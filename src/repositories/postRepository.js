//게시글 관련 데이터베이스 접근
import prisma from '../prismaClient.js'; 

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
                groupId:11, //직접 그룹 아이디를 입력해서 확인
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


    // 게시물 상세 조회
    async findPostById(postId) {
        return prisma.post.findUnique({
            where: { id: parseInt(postId, 10) },
            select: {
                id: true,
                nickname: true,
                title: true,
                content: true,
                imageUrl: true,
                tags: true,
                location: true,
                moment: true,
                isPublic: true,
                likeCount: true,  // 공감 수
                commentCount: true,  // 댓글 수
                createdAt: true,
                updatedAt: true,
                groupId: true,  // 추가 필드
            }
        });
    }

    // 좋아요 수 증가시키기
    async incrementLikeCount(postId) {
        return prisma.post.update({
            where: { id: parseInt(postId, 10) },
            data: {
                likeCount: {
                increment: 1,
                },
            },
            select: {
                id: true,
                likeCount: true,  // 공감 수 반환
            },
        });
    }

    
    //게시글 수정
    async updatePost(postId,updateData){
        if (updateData.moment) {
            // '2024-02-21'을 '2024-02-21T00:00:00.000Z'으로 변환
            updateData.moment = new Date(updateData.moment).toISOString();
        }
        return prisma.post.update({
            where: {id:parseInt(postId,10)},
            data: updateData, //수정할 데이터 적용
        })
    }

    //게시글 삭제
    async deletePost(postId){
        return prisma.post.delete({
            where: {id:parseInt(postId,10)},
        });
    }

    //비밀번호 확인
    async findPostPasswordById(postId){
        return prisma.post.findUnique({
            where:{ id:parseInt(postId,10)},
            select:{
                postPassword: true,
            },
        });
    }

    //게시물 공개 여부 확인
    async verifyPostIsPublic(postId) {
        return prisma.post.findUnique({
            where: { id: parseInt(postId, 10) },
            select: {
                id: true,
                isPublic: true,  // 공개 여부를 가져오도록 설정
            },
        });
    }


}

export default new PostRepository();