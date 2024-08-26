import prisma from "../prismaClient.js";

class badgeReopistory{
    //모든 배지 목록 조회
    async findAllBadges(){
        return prisma.badge.findMany();
    }

    //특정 아이디로 배지 조회
    async findBageById(badgeId){
        return prisma.badge.findUnique({
            where:{id:badgeId},
        });
    }

    //새로운 배지 생성
    async creatBadge(data){
        return prisma.badge.create({
            data,
        });
    }

    //특정 그룹의 배지 목록 조히
    async getBadgesForGroup(groupId){
        return prisma.groupBadge.findMany({
            where: {groupId},
            include:{badge:true},
        });
    }

    //그룹에 배지 추가
    async addBadgeToGroup(groupId, badgeId){
        return prisma.groupBadge.create({
            data:{
                groupId,
                badgeId,
            },
        });
    }
}

export default new badgeReopistory();