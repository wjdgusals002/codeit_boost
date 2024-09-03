import commentRepository from '../repositories/commentRepository.js';

class CommentService {
    // 댓글 등록
    async createComment(postId, { nickname, content, password }) {
        const newComment = await commentRepository.createComment(postId, { nickname, content, password });
        return {
            id: newComment.commentId, // Prisma에서 반환하는 ID를 사용
            nickname: newComment.nickname,
            content: newComment.content,
            createdAt: newComment.createdAt
        };
    }

    // 댓글 수정
    async updateComment(commentId, nickname, content, password) {
        // 댓글 찾기
        const comment = await commentRepository.findCommentById(commentId);

        // 존재하지 않는 댓글은 수정 불가
        if (!comment) {
            return null;
        }

        if (comment.password !== password) {
            throw new Error('비밀번호가 틀렸습니다.');
        }

        // 댓글 업데이트
        const updatedComment = await commentRepository.updateComment(commentId, { nickname, content });

        return {
            id: updatedComment.commentId,
            nickname: updatedComment.nickname,
            content: updatedComment.content,
            createdAt: updatedComment.createdAt,
        };
    }

    // 댓글 삭제
    async deleteComment(commentId, password) {
        // 댓글 존재 확인
        const comment = await commentRepository.findCommentById(commentId);
        if (!comment) {
            return "NOT_FOUND";
        }

        // 비밀번호 일치 여부 확인
        if (comment.password !== password) {
            return "FORBIDDEN";
        }

        // 댓글 삭제
        await commentRepository.deleteCommentById(commentId);

        return "SUCCESS";
    }

    // 댓글 목록 조회
    async getComments(postId, page, pageSize) {
        const offset = (page - 1) * pageSize; // 페이지 계산
        const [totalItemCount, comments] = await Promise.all([
            commentRepository.countCommentsByPostId(postId), // 총 댓글 수 가져오기
            commentRepository.findCommentsByPostId(postId, offset, pageSize), // 해당 페이지의 댓글 목록을 가져오기
        ]);

        const totalPages = Math.ceil(totalItemCount / pageSize); // 총 페이지 수를 계산

        return {
            currentPage: page, // 현재 페이지 번호
            totalPages, // 총 페이지 수
            totalItemCount, // 전체 댓글 수
            data: comments.map(comment => ({
                id: comment.commentId,
                nickname: comment.nickname,
                content: comment.content,
                createdAt: comment.createdAt
            })),
        };
    }
}

export default new CommentService();