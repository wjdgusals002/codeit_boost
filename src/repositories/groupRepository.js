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
    async getGroupById(id){
        return prisma.group.findUnique({where: {id}});
    }

    //그룹 수정
    async updateGroup(id,data){
        return prisma.group.update({
            where:{id},
            data,
        });
    }

    //그룹 삭제
    async deleteGroup(id){
        return prisma.group.delete({
            where: {id},
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
    //prisma를 사용해서 그룹 목록 조회
    async getGroups({
        page =1,
        pageSize =10,
        sortBy ='latest',
        keyword = '',
        isPublic = null,
    }){
        const sortOptions = {
            latest: {createdAt: 'desc'},
            mostPosted :{postCount:'desc'},
            mostLiked:{likeCount:'desc'},
            mostBadge:{badgeCount:'desc'},
        };

        const whereConditions ={
            ...(keyword && {name: {contains:keyword,mode:'insensitive'}}),
            ...(isPublic !==null && {isPublic}),
        };

        const groups =await prisma.group.findMany({
            where: whereConditions,
            orderBy:sortOptions[sortBy]||sortOptions.latest,
            skip:(page-1)*pageSize,
            take: pageSize,
        });

        const totalCount = await prisma.group.count({
            where:whereConditions,
        });
        
        return {
            totalItemCount,
            data:groups,
        };
    }


}

export default new GroupRepository();
