//게시글 관련 비즈니스 로직
//그룹 비밀번호를 확인하고 사용자가 해당 그룹에 게시글을 작성할 권한이 있는지 확인
import postRepository from '../repositories/postRepository.js';
import groupRepository from '../repositories/groupRepository.js';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

class PostService{
    // 게시글 등록
    async createPost(postData) {
        const { groupId, groupPassword, ...postDetails } = postData;
        const groupIdInt = parseInt(groupId, 10);

        // 그룹 비밀번호 확인
        const group = await groupRepository.getGroupById(groupIdInt);
        if (!group) {
            throw { status: 404, message: '그룹을 찾을 수 없습니다.' };
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(groupPassword, group.password);
        if (!isPasswordValid) {
            throw { status: 403, message: '그룹 비밀번호가 틀렸습니다.' };
        }

        // 게시글 등록
        return postRepository.createPost({
            ...postDetails,
            groupId: groupIdInt,
        });
    }
    
    // 게시물 목록 조회
    async getPostsByGroupId({ groupId, page, pageSize, sortBy, keyword, isPublic }) {
        const filters = {
            groupId: parseInt(groupId, 10),
            isPublic: isPublic !== undefined ? isPublic : undefined,
            OR: keyword ? [
                { title: { contains: keyword, mode: 'insensitive' } },
                { tags: { has: keyword } }
            ] : undefined,
        };
    
        const sortOptions = {
            latest: { createdAt: 'desc' },
            mostCommented: { commentCount: 'desc' },
            mostLiked: { likeCount: 'desc' },
        };
    
        console.log('Filters:', filters);
        console.log('Sort Options:', sortOptions[sortBy] || sortOptions.latest);
    
        const [totalItemCount, data] = await Promise.all([
            postRepository.countPosts(filters),
            postRepository.findPosts({
                where: filters,
                orderBy: sortOptions[sortBy] || sortOptions.latest,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
    
        console.log('Total Item Count:', totalItemCount);
        console.log('Data:', data);
    
        return {
            currentPage: page,
            totalPages: Math.ceil(totalItemCount / pageSize),
            totalItemCount,
            data,
        };
    }
    


    //게시글 수정
    async updatePost(postId,postPassword,updateData){
        const post= await postRepository.findPostById(postId);

        if(!post){
            throw{status:404,message:'존재하지 않는 게시글입니다.'};
        }

        if(post.postPassword !== postPassword){
            throw{status:403,message:'비밀번호가 일치하지 않습니다.'};
        }
        return await postRepository.updatePost(postId,updateData);
    }

    //게시글 삭제
    async deletePost(postId,postPassword){
        const post = await postRepository.findPostById(postId);

        if(!post){
            throw{status:404,message:'존재하지 않는 게시글입니다.'};
        }

        if(post.postPassword !== postPassword){
            throw {status:403, message:'비밀번호가 일치하지 않습니다.'}
        }

        await postRepository.deletePost(postId);
    }

    //게시글 상세 정보 조회
    async getPostDetails(postId) {
        const post = await postRepository.findPostById(postId);
    
        if (!post) {
            throw { status: 404, message: '존재하지 않는 게시글입니다.' };
        }
    
        // 상세 정보 반환
        return {
            id: post.id,
            groupId: post.groupId,
            nickname: post.nickname,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            tags: post.tags,
            location: post.location,
            moment: post.moment,
            isPublic: post.isPublic,
            likeCount: post.likeCount,
            commentCount: post.commentCount  ,
            createdAt: post.createdAt,
        };
    }
    
    //게시물 공감하기
    async incrementLikeCount(postId) {
        const post = await postRepository.findPostById(postId);
    
        if (!post) {
            return null; // 게시글이 없다면 null을 반환
        }
    
        // 게시물 좋아요 수 증가시키기
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId, 10) },
            data: { likeCount: { increment: 1 } },
            select: {
                id: true,
                likeCount: true,  
            },
        });
    
        return updatedPost;
    }

    //게시물 권한 조회
    async verifyPostPassword(postId,inputPassword){
        const postPasswordData = await postRepository.findPostPasswordById(postId);

        if(!postPasswordData){
            throw{status:404,message:'존재하지 않는 게시물입니다'};
        }
        
        const isPasswordCorrect = postPasswordData.postPassword === inputPassword; //해시화 하지 않고 평문 비밀번호로 비교
        return isPasswordCorrect;
    }
    //게시글 공개 여부 확인
    async isPublic(postId){
        const post = await postRepository.verifyPostIsPublic(postId);

        if(!post){
            return null;
        }

        return{
            id:post.id,
            isPublic:post.isPublic,
        };
    }
}
export default new PostService();