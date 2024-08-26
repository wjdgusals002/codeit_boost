//게시글 관련 로직 컨트롤러
import postService from "../services/postService.js";

class PostController{
    //게시글 등록
    async createPost(req,res){
        try{
            const postData=req.body;
            const newPost= await postService.createPost(postData);
            res.status(201).json(newPost);
        }catch(error){
            res.status(error.status ||500).json({message:error.message ||'서버 오류가 발생했습니다.'});
        }
    }

    //게시물 목록 조회
    async getPostByGroupId(req,res){
        try{
            const {groupId}=req.params;
            const {page=1,pageSize=10,sortBy='latest',keyword='',isPublic}=req.query;

            const posts = await postService.getPostByGroupId({
                groupId,
                page:parseInt(page,10),
                pageSize:parseInt(pageSize,10),
                sortBy,
                keyword,
                isPublic:isPublic ==='true',
            });

            res.status(200).json(posts);
        }catch(error){
            res.status(error.status ||500).json({message:error.message||'서버 오류가 발생했습니다.'})
        }
    }
    //게시글 수정 
    async updatePost(req,res){
        try{
            const {postId}= req.params;
            const{postPassword, ...updateData}= req.body;

            const updatedPost = await postService.updatePost(postId, postPassword,updateData);
            res.status(200).json(updatedPost);
        }catch(error){
            res.status(error.status||500).json({message: errpr.message||'서버 오류가 발생했습니다'});
        }
    }

    //게시글 삭제
    async deletePost(req,res){
        try{
            const {postId}= req.params;
            const{postPassword}=req.body;

            await postService.deletePost(postId, postPassword);
            res.status(200).json({message:'게시글이 성공적으로 삭제되었습니다.'});
        }catch(error){
            res.status(error.status||500).json({message:error.message||'서버 오류 발생'});
        }
    }

    //게시글 상세 정보 조회
    async getPostDetails(req,res){
        try{
            const {postId}= req.params;
            const postDetails= await postService.getPostDetails(postId);
            res.status(200).json(postDetails);
        }catch(error){
            res.status(error.status||500).json({message:error.message||'서버 오류 발생'});
        }
    }

    //게시글 조회 권한 확인
    async verifyPostPassword(req,res){
        try{
            const{postId}=req.params;
            const {password}=req.body;

            const isPasswordCorrect = await postService.verifyPostPassword(postId,password);

            if(isPasswordCorrect){
                res.status(200).json({message:'비밀번호가 확인되었습니다.'});
            }else{
                res.status(401).json({message:'비밀번호가 틀렸습니다.'})
            }
        }catch(error){
            res.status(error.status||500).json({message:error.message||'서버 오류'})
        }
    }

    //게시물 공감하기
    async likePost(req,res){
        const {postId}= req.params;

        try{
            const post = await postService.likePost(postId);

            if(!post){
                return res.status(404).json({message:'존재하지 않습니다.'});
            }

            return res.status(200).json({message:'게시물 공감하기 성공'});
        }catch(error){
            console.error(error);
            return res.status(500).json({message:'서버 오류입니다.'})
        }
    }

    //게시글 공개 여부 확인
    async isPublic(req,res){
        try{
            const {postId}= req.params;
            const post = await postService.isPublic(postId);

            if(!post){
                return res.status(404).json({message:'존재하지 않는 게시글입니다.'});
            }

            return res.status(200).json({
                id:post.id,
                isPublic:post.isPublic,
            });
        }catch(error){
            console.error(error);
            return res.status(500).json({message:'서버 오류입니다.'});
        }
    }
}
export default new PostController();