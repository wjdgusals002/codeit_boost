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

    //비밀번호 확인하고 그룹 정보 업데이트
    async updateGroup(id,updateData,inPutPassword){
        const group = await groupRepository.getGroupById(id);
        if(!group){
            throw {status:404, message:'존재하지 않습니다.'}
        }; //그룹 존재 여부 확인

        const isPasswordValid = await bcrypt.compare(inPutPassword, group.password);
        if (!isPasswordValid){
            throw {status:403,message:'잘못된 비밀번호입니다.'}
        }; //비밀번호 일치여부 확인

        const updatedGroup = await groupRepository.updateGroup(id,updateData);
        return {
            id: updatedGroup.id,
            name: updatedGroup.name,
            imageUrl: updatedGroup.imageUrl,
            isPublic: updatedGroup.isPublic,
            likeCount: updatedGroup.likeCount,
            badges: updatedGroup.badges,
            postCount: updatedGroup.postCount,
            createdAt: updatedGroup.createdAt,
            introduction:updatedGroup.introduction,
        };
        }

        //그룹 삭제
        async deleteGroup(id,inPutPassword){
            const group = await groupRepository.getGroupById(id); //id로 그룹 조회

            if(!group){
                throw {status:404, message:'그룹을 찾을 수 없습니다.'};
            }

            const isPasswordValid = await bcrypt.compare(inPutPassword, group.password); //비밀번호 검증
            if(!isPasswordValid){
                throw{status:403, message:'잘못된 비밀번호입니다.'};
            }

            await groupRepository.deleteGroup(id); //비밀번호가 맞다면 그룹 삭제
            return {message:'그룹 삭제 성공'}; //삭제 성공 메시지 반환
        }

        //그룹 목록조회
        async getGroups(params){
            const {page= 1, pageSize=10, sortBy ='latest',keyword= '',isPublic=null} = params;

            const{totalItemCount, data}= await groupRepository.getGroups({
                page,
                pageSize,
                sortBy,
                keyword,
                isPublic,
            });

            return{
                currentPage : page,
                totalPages:Math.ceil(totalItemCount/pageSize),
                data:data.map(group =>({
                    id:group.id,
                    name:group.name,
                    imageUrl: group.imageUrl,
                    isPublic: group.isPublic,
                    likeCount: group.likeCount,
                    badgeCount:group.badges.length,
                    postCount: group.postCount,
                    createdAt:group.createdAt,
                    introduction:group.introduction,
                })),
            };
        }
        //비밀번호 일치 여부 확인
        async getGroupById(id,password){
            const group = await groupRepository.getGroupById(id);

            if(!group){
                throw {status:404,message:'그룹을 찾을 수 없습니다'};
            }
            if(!group.isPublic && group.password !== password){
                throw {status:403,message:'비밀번호가 틀렸습니다.'};
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
            return group.password===password;
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
