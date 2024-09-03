import prisma from '../prismaClient.js';

class CommentRepository {
    // 댓글 등록
    async createComment(postId, { nickname, content, password }) {
        const newComment = await prisma.comment.create({
            data: {
                nickname,
                content,
                password,
                post: {
                    connect: { id: parseInt(postId, 10) } // postId로 연결
                }
            }
        });
        return newComment;
    }

    // 댓글 찾기 기능
    async findCommentById(commentId) {
        return prisma.comment.findUnique({
            where: { commentId: parseInt(commentId, 10) },
        });
    }

    // 댓글 수정 기능
    async updateComment(commentId, updateData) {
        return prisma.comment.update({
            where: { commentId: parseInt(commentId, 10) },
            data: updateData,
        });
    }

    // 댓글 삭제 기능
    async deleteCommentById(commentId) {
        return prisma.comment.delete({
            where: { commentId: parseInt(commentId, 10) },
        });
    }

    // 댓글 수 카운트 기능
    async countCommentsByPostId(postId) {
        return prisma.comment.count({
            where: { postId: parseInt(postId, 10) },
        });
    }

    // 댓글 찾기 기능
    async findCommentsByPostId(postId, offset, limit) {
        return prisma.comment.findMany({
            where: { postId: parseInt(postId, 10) },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}

export default new CommentRepository();
