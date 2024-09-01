//게시글 관련 데이터베이스 접근
import prisma from "../prismaClient.js";

class PostRepository{
    // 특정 그룹에 게시글 등록
    async createPost(postData) {
        return prisma.post.create({
            data: postData,
        });
    }

    async countPosts(filters) {
        console.log('Counting posts with filters:', filters);
        return prisma.post.count({ where: filters });
    }
    
    async findPosts({ where, orderBy, skip, take }) {
        console.log('Finding posts with filters:', { where, orderBy, skip, take });
        return prisma.post.findMany({
            where:{
                groupId:15, //직접 그룹 아이디를 입력해서 확인
            },
            orderBy,
            skip,
            take,
            select: {
                id: true,
                nickname: true,
                title: true,
                imageUrl: true,
                tags: true,
                location: true,
                moment: true,
                isPublic: true,
                likeCount: true,
                commentCount: true,
                createdAt: true,
            }
        });
    }
    

    
    //게시글 조회, 게시글 상세 조회, 게시글 권한 조회
    async findPostById(postId){
        return prisma.post.findUnique({
            where: {id:parseInt(postId,10)},
            include:{
                comment:true, //댓글 목록을 포함
            },
            select:{
                id:true,
                isPublic:true, //게시글 공개 여부 확인
            }
        });
    }
    
    //게시글 수정
    async updatePost(postId,updateData){
        return prisma.post.update({
            where: {id:parseInt(postId,10)},
        })
    }

    //게시글 삭제
    async deletePost(postId){
        return prisma.post.delete({
            where: {id:parseInt(postId,10)},
        });
    }

    //좋아요 수 증가 시키기
    async incrementLikeCount(postId){
        return prisma.post.update({
            where:{id:parseInt(postId,10)},
            data:{
                likeCount:{
                    increment:1,
                },
            },
        });
    }
}

export default new PostRepository();