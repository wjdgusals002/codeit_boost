//게시글 관련 로직 컨트롤러
import postService from "../services/postService.js";
import imageService from "../services/imageService.js";


class PostController{
    // 게시글 등록
    async createPost(req, res) {
        try {
            const { groupid } = req.params; // URL 파라미터에서 groupid를 읽음
            const { groupPassword,moment, ...postDetails } = req.body;

            const momentDate = new Date(moment).toISOString();

            if (!groupid || !groupPassword) {
                return res.status(400).json({ message: '잘못된 요청입니다' });
            }

            // 게시글 데이터에 groupId와 groupPassword 추가
            const postData = {
                ...postDetails,
                groupId: parseInt(groupid, 10),
                groupPassword,
                moment:momentDate,
            };

            const newPost = await postService.createPost(postData);
            res.status(201).json(newPost);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || '서버 오류가 발생했습니다.' });
        }
    }



    // 게시물 목록 조회
    async getPostsByGroupId(req, res) {
        try {
            const { groupid } = req.params; // 그룹 아이디
            const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query; // 쿼리 파라미터
    
            console.log('Parameters:', { groupid, page, pageSize, sortBy, keyword, isPublic });
    
            const posts = await postService.getPostsByGroupId({
                groupId: groupid,
                page: parseInt(page, 10),
                pageSize: parseInt(pageSize, 10),
                sortBy,
                keyword,
                isPublic: isPublic === 'true',
            });
    
            console.log('Posts:', posts);
    
            res.status(200).json(posts);
        } catch (error) {
            console.error('Error:', error);
            res.status(error.status || 500).json({ message: error.message || '서버 오류가 발생했습니다.' });
        }
    }
    

    //게시글 수정 
    async updatePost(req,res){
        try{
            const {postId}= req.params;
            const{postPassword, ...updateData}= req.body;

            const updatedPost = await postService.updatePost(parseInt(postId,10), postPassword,updateData);
            res.status(200).json(updatedPost);
        }catch(error){
            res.status(error.status||500).json({message: error.message||'서버 오류가 발생했습니다'});
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

    // 공감 증가
    async incrementLike(req, res) {
        try {
            const { postId } = req.params;
            const updatedPost = await postService.incrementLikeCount(postId);
    
            if (!updatedPost) {
                return res.status(404).json({ message: '존재하지 않습니다.' });
            }
    
            res.status(200).json({ message: '게시글 공감하기 성공'});
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Server error occurred' });
        }
    }

    //게시글 조회 권한 확인
    async verifyPostPassword(req,res){
        try{
            const{postId}=req.params;
            const {postPassword}=req.body;

            const isPasswordCorrect = await postService.verifyPostPassword(postId,postPassword);

            if(isPasswordCorrect){
                res.status(200).json({message:'비밀번호가 확인되었습니다.'});
            }else{
                res.status(401).json({message:'비밀번호가 틀렸습니다.'})
            }
        }catch(error){
            res.status(error.status||500).json({message:error.message||'서버 오류'})
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