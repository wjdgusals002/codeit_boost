//비즈니스 로직 처리
//컨트롤러와 레포지토리 사이 중간다리 연결

// src/services/groupService.js
//비밀번호 해싱후 레포지토리에 데이터를 전달 -> 그룹 생성
import bcrypt from 'bcryptjs';
import groupRepository from '../repositories/groupRepository.js';

class GroupService {
    //그룹 생성
    async createGroup(data) {
        const { password, ...rest } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        return groupRepository.createGroup({ ...rest, password: hashedPassword });
    }


    // 비밀번호 확인하고 그룹 정보 업데이트
    async updateGroup(groupid, updateData, inPutPassword) {
        try {
            const groupId = parseInt(groupid, 10); // ID를 정수로 변환
            if (isNaN(groupId)) {
                throw { status: 400, message: '유효하지 않은 그룹 ID입니다.' };
                }
            const group = await groupRepository.getGroupById(groupid);
            if (!group) {
                throw { status: 404, message: '그룹을 찾을 수 없습니다.' };
            }
    
            const isPasswordValid = await this.verifyPassword(groupid, inPutPassword);
            if (!isPasswordValid) {
                throw { status: 403, message: '비밀번호가 틀렸습니다.' };
            }
    
            const updatedGroup = await groupRepository.updateGroup(groupid, updateData);
            return {
                id: updatedGroup.id,
                name: updatedGroup.name,
                imageUrl: updatedGroup.imageUrl,
                isPublic: updatedGroup.isPublic,
                likeCount: updatedGroup.likeCount,
                badges: updatedGroup.badges,
                postCount: updatedGroup.postCount,
                createdAt: updatedGroup.createdAt,
                introduction: updatedGroup.introduction,
            };
        } catch (error) {
            console.error('Service updateGroup error:', error); // 로그 추가
            throw error;
        }
    }
    
    // 그룹 삭제
    async deleteGroup(groupid, inPutPassword) {
        const group = await groupRepository.getGroupById(groupid); // 레포지토리에서 그룹 조회

        if (!group) {
            throw { status: 404, message: '그룹을 찾을 수 없습니다.' };
        }

        const isPasswordValid = await this.verifyPassword(groupid, inPutPassword); // 비밀번호 검증
        if (!isPasswordValid) {
            throw { status: 403, message: '잘못된 비밀번호입니다.' };
        }

        await groupRepository.deleteGroup(groupid); // 그룹 삭제
        return { message: '그룹 삭제 성공' }; // 성공 메시지 반환
    }



    // 그룹 목록 조회
    async getGroups(params) {
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic = null } = params;

        const { totalItemCount, data } = await groupRepository.getGroups({
            page,
            pageSize,
            sortBy,
            keyword,
            isPublic,
            });

        return {
            currentPage: page,
            totalPages: Math.ceil(totalItemCount / pageSize),
            data: data.map(group => ({
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,  // 그룹 대표 이미지
            isPublic: group.isPublic,
            dDay: Math.floor((Date.now() - new Date(group.createdAt)) / (1000 * 60 * 60 * 24)),  // 디데이 계산
            likeCount: group.likeCount,  // 그룹 공감수
            badgeCount: group.badges.length,  // 획득 배지수
            postCount: group.postCount,  // 추억수
            createdAt: group.createdAt,
            introduction: group.introduction,  // 그룹 소개
            })),
        };
    }

    // 그룹 상세 조회
    async getGroupById(groupid, password) {
        const group = await groupRepository.getGroupById(groupid);

        if (!group) {
            throw { status: 404, message: '그룹을 찾을 수 없습니다' };
        }

        if (!group.isPublic) {
            const isPasswordValid = await bcrypt.compare(password, group.password);
            if (!isPasswordValid) {
                throw { status: 403, message: '비밀번호가 틀렸습니다.' };
            }
        }

        return {
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,  // 그룹 대표 이미지
            isPublic: group.isPublic,
            dDay: Math.floor((Date.now() - new Date(group.createdAt)) / (1000 * 60 * 60 * 24)),  // 디데이 계산
            likeCount: group.likeCount,  // 그룹 공감수
            badges: group.badges,  // 획득 배지 목록
            postCount: group.postCount,  // 추억수
            createdAt: group.createdAt,
            introduction: group.introduction,  // 그룹 소개
        };
    }

        //비밀번호 일치 여부 확인
        async getGroupById(groupid,password){
            const group = await groupRepository.getGroupById(groupid);

            if(!group){
                throw {status:404,message:'그룹을 찾을 수 없습니다'};
            }
            if(!group.isPublic){
                const isPasswordValid= await this.verifyPassword(groupid, password);
                if (!isPasswordValid){
                    throw {status:403,message:'비밀번호가 틀렸습니다.'};
                }
            } 
            const badges = group.badges ||[];

            return {
                id:group.id,
                name: group.name,
                imageUrl: group.imageUrl,
                isPublic: group.isPublic,
                likeCount: group.likeCount,
                badges,
                postCount: group.postCount,
                createdAt: group.createdAt,
                introduction: group.introduction,
            };
        }
        //좋아요 수 증가
        async incrementLikeCount(id){
            const updatedGroup=await groupRepository.incrementLikeCount(id);
            return updatedGroup.likeCount;
        }

        //그룹 비밀번호 확인 메소드
        async verifyPassword(groupId,password){
            const group = await groupRepository.getGroupById(groupId);
            if(!group){
                throw {status:404, message:'그룹을 찾을 수 없습니다'};
            }
            const isPasswordValid = await bcrypt.compare(password,group.password);
            return isPasswordValid;
        }

        //그룹 공개 여부 확인
        async isPublic(groupId){
            const group = await groupRepository.getGroupById(groupId);
            if(!group){
                throw{status:404,message:'그룹을 찾을 수 없습니다.'};
            }
            return group.isPublic;
        }
    }
export default new GroupService();
