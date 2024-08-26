//클라이언트 요청을 받아드리고 서비스로 전달하고, 결과를 응답

//클라이언트 요청을 처리
// src/controllers/groupController.js
import groupService from '../services/groupService.js';

class GroupController {
    //그룹 생성
    async createGroup(req, res) {
        try {
            const newGroup = await groupService.createGroup(req.body);
            res.status(201).json(newGroup);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create group' });
        }
    }

    //그룹 업데이트
    async updateGroup(req,res){
        try{
            const {id}= req.params;
            const {password, ...updateData}= req.body;

            if(!password){
                return res.status(400).json({error:'비밀번호가 틀립니다'});
            }

            const updatedGroup= await groupService.updateGroup(parseInt(id),updateData,password);
            res.status(200).json(updatedGroup);
        }catch(error){
            if(error.status){
                res.status(error.status).json({error: error.message});
            }else{
                res.status(500).json({error:'failed to update group'});
            }
        }
    }

    //그룹 삭제
    async deleteGroup(req,res){
        try{
            const{id}=req.params;
            const{password}=req.body;

            if(!password){
                return res.status(400).json({message:'잘못된 요청입니다'});
            }
            const result = await groupService.deleteGroup(parseInt(id),password);
            res.status(200).json(result);
        }catch(error){
            if(error.status){
                res.status(error.status).json({message:error.message});
            }else{
                res.status(500).json({message:'잘못된 요청입니다.'})
            }
        }
    }

    //그룹 목록 조회
    async getGroups(req,res) {
        try{
            const {page=1,pageSize =10,soryBy='latest',keyword= '',isPublic=null}=req.query;
            const groups= await groupService.getGroups({
                page:parseInt(page),
                pageSize:parseInt(pageSize),
                sortBy,
                keyword,
                isPublic:isPublic ==='true' ? true:isPublic ==='false'? false:null,
            });
            res.status(200).json(groups);
        }catch(error){
            res.status(500).json({error:'그룹 목록 조회 실패'});
        }
    }
    //그룹 상세 조회
    async getGroupById(req,res){
        try{
            const {id}=req.params;
            const {password}=req.body;

            if(!id){
                return res.status(400).json({message:'잘못된 요청입니다.'});
            }
            const group = await groupService.getGroupById(parseInt(id),password);
            res.status(200).json(group);
        }catch(error){
            res.status(error.status || 500).json({message:error.message||'서버오류가 발생했습니다.'});
        }
    }

    //그룹 공감 보내기
    async likeGroup(req,res){
        try{
            const{id}=req.params;

            if(!id){
                return res.status(400).json({message:'존재하지 않습니다.'})
            }
            const likeCount =await groupService.incrementLikeCount(parseInt(id));
            res.status(200).json({message:'그룹 공감하기 성공'});
        }catch(error){
            res.status(500).json({message:'서버 오류 발생!'});
        }
    }

    //그룹 조회 권한 확인
    async verifyPassword(req,res){
        try{
            const {groupId}= req.params;
            const {password}= req.body;

            const isValid = await groupService.verifyPassword(groupId,password);

            if(isValid){
                return res.status(200).json({message:'비밀번호가 일치합니다'});
            }else{
                return res.status(403).json({message:'비밀번호가 틀렸습니다'});
            }
        }catch(error){
            res.status(500).json({message:'서버 오류가 발생했습니다'});
        }
    }

    //그룹 공개 여부 확인
    async isPublic(req,res){
        try{
            const{groupId}=req.params;

            const isPublic = await groupService.isPublic(groupId);

            return res.status(200).json({isPublic});
        }catch(error){
            res.status(500).json({message:'서버 오류가 발생했습니다.'})
        }
    }
}

export default new GroupController();
