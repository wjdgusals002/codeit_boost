import prisma from '../prismaClient.js';

class commentRepository{
    //댓글 등록
    async createComment(commentId,{nickname,content,password}){
        const newComment = await prisma.comment.create({
            data:{
                commentId:parseInt(commentId,10),
                nickname,
                content,
                password,
            },
        });
        return newComment;
    }

    //댓글 찾기 기능
    async findCommentById(commentId){
        return prisma.comment.findUnique({
            where:{id:parseInt(commentId,10)},
        });
    };

    //댓글 수정 기능
    async updateComment(commentId,updateData){
        return prisma.comment.update({
            where:{id:parseInt(commentId,10)},
            data:updateData,
        });
    };

    //댓글 삭제 기능
    async deleteCommentById(commentId){
        return prisma.comment.delete({
            where:{id:parseInt(commentId,10)},
        });
    };

    //댓글 수 카운트 기능
    async countCommentsByPostId(commentId){
        return prisma.comment,count({
            where: {commentId:parseInt(commentId,10)},
        });
    }

    //댓글 찾기 기능
    async findCommentsByPostId(commentId,offset,limit){
        return prisma.comment.findMany({
            where: {commentId:parseInt(commentId,10)},
            skip: offset,
            take: limit,
            orderBy: {createdAt:'desc'},
        });
    }
}

export default new commentRepository();