import badgeService from "../services/badgeService.js";

class badgeController{
    async checkAndAwardBadges(req,res){
        try{
            const {groupId}= req.params;
            const badges= await badgeService.checkAndAwardBadgesForGroup(Number(groupId));
            res.json({badges});
        }catch(error){
            res.status(400).json({message:error.message});
        }
    }
}
export default new badgeController();