import badgeRepository from "../repositories/badgeRepository.js";
import groupRepository from "../repositories/groupRepository.js";
import postRepository from "../repositories/postRepository.js";


class badgeService{
    async checkAndAwardBadgesForGroup(groupId){
        const group = await groupRepository.findGroupById(groupId);

        if(!group){
            throw new Error('Group Not Found');
        }

        const badgeToAward =[];

        //7일 연속 추억 등록 체크
        const last7DaysPost = await postRepository.findPostForLastDays(groupId,7);
        if(last7DaysPost.length >=7){
            badgeToAward.push({name:'7일 연속 추억 등록',description:'7일 연속으로 추억을 등록했습니다.'});
        }

        //추억 수 20개 이상 등록 체크
        const totalPosts = await postRepository.countPostsByGroup(groupId);
        if(totalPosts >=20){
            badgeToAward.push({name:'추억 수 20개 이상 등록',description:'추억 수가 20개를 초과했습니다.'});
        }

        //그룹 생성 후 1년
        const groupCreationDate = new Date(group.createdAt);
        const oneYearLater= new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear()-1);
        if(groupCreationDate <=oneYearLater){
            badgeToAward.push({name:'그룹 생성 후 1년 달성',description:'그룹 생성 후 1년이 지났습니다.'});
        }

        //그룹 공감 1만개 이상 받기
        const groupTotalLikes = await postRepository.countLikeByGroup(groupId);
        if(groupTotalLikes >=10000){
            badgeToAward.push({name:'그룹 공감 1만개 받기',description:'그룹의 공감이 1만개를 초과했습니다'});
        }

        //추억 공감 1만개 이상 받기 체크
        const postTotalLikes = await postRepository.findPostsWithLikesAboce(groupId,10000);
        if(postTotalLikes.length >0){
            badgeToAward.push({name:'추억 공감 1만 개 이상 받기',description:'공감이 1만 개를 초과한 추억이 있습니다'});
        }

        for(const badge of badgeToAward){
            const existingBadge = await badgeRepository.findBageById(badge.id);
            if(!existingBadge){
                await badgeRepository.creatBadge(badge);
            }
            await badgeRepository.addBadgeToGroup(groupID,badge.id);
        }

        return badgeToAward;
    }
}
export default new badgeService();