//데이터베이스와 직접 상호작용하는 공간 or prisma로 데이터를 저장하거나 조회

//그룹 관련 데이터베이스 작업 처리
// src/repositories/groupRepository.js
import prisma from '../prismaClient.js';

class GroupRepository {
    //그룹 생성
    async createGroup(data) { //createGroup 메소드 정의 그룹 데이터를 데이터베이스에 저장
        return prisma.group.create({ data });
    }

    //그룹 조회(ID로 조회)
    async getGroupById(groupId){
        return prisma.group.findUnique({
            where: {groupId},
            include: {badges:true},
        });
    }

    //그룹 수정
    async updateGroup(id, data) {
        try {
            const groupId = parseInt(id, 10); // ID를 정수로 변환
            if (isNaN(groupId)) {
                throw new Error('유효하지 않은 그룹 ID입니다.');
            }
    
            return prisma.group.update({
                where: { id: groupId },
                data,
            });
        } catch (error) {
            console.error('Repository updateGroup error:', error); // 로그 추가
            throw error;
        }
    }
    

    // 그룹 삭제
    async deleteGroup(id) {
        if (!Number.isInteger(id)) {
            throw new Error('ID must be an integer');
        }

        return prisma.group.delete({
            where: { id },
        });
    }


    //그룹 공감 수 증가
    async incrementLikeCount(id){
        return prisma.group.update({
            where : {id},
            data:{likeCount:{increment:1}},
        });
    }
    
    //그룹 목록 조회
    // Prisma를 사용해서 그룹 목록 조회
    async getGroups({
        page = 1,
        pageSize = 10,
        sortBy = 'latest',
        keyword = '',
        isPublic = null,
    }) {
        const sortOptions = {
            latest: { createdAt: 'desc' },
            mostPosted: { postCount: 'desc' },
            mostLiked: { likeCount: 'desc' },
            mostBadge: { badges: { _count: 'desc' } },
        };

        const whereConditions = {
            ...(keyword && { name: { contains: keyword, mode: 'insensitive' } }),
            ...(isPublic !== null && { isPublic }),
        };

        const groups = await prisma.group.findMany({
            where: whereConditions,
            orderBy: sortOptions[sortBy] || sortOptions.latest,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
                badges: true,  // badges 필드를 포함하여 조회
            },
        });

        const totalItemCount = await prisma.group.count({
            where: whereConditions,
        });

        return {
            totalItemCount,  // 총 그룹 수
            data: groups,
        };
    }

    // 그룹 상세 조회
    async getGroupById(id) {
        return prisma.group.findUnique({
            where: { id },
            include: {
                badges: true,  // badges 필드를 포함하여 조회
            },
        });
    }

    // 그룹 공개여부 확인
    async getGroupById(id) {
        return prisma.group.findUnique({
            where: { id: parseInt(id, 10) }, // ID를 정수로 변환
        });
    }

    async getGroupById(id) {
        return prisma.group.findUnique({
            where: { id: id },
        });
    }
    

}

export default new GroupRepository();
