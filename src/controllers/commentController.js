import commentService from '../services/commentService.js';

class CommentController {
    // 댓글 등록
    async createComment(req, res) {
        try {
            const { postId } = req.params;
            const { nickname, content, password } = req.body;

            if (!nickname || !content || !password) {
                return res.status(400).json({ message: '잘못된 요청입니다.' });
            }

            const newComment = await commentService.createComment(postId, { nickname, content, password });
            return res.status(200).json(newComment);
        } catch (error) {
            console.error('Error', error);
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }
    }

    // 댓글 수정
    async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const { nickname, content, password } = req.body;

            if (!nickname || !content || !password) {
                return res.status(400).json({ message: '잘못된 요청입니다.' });
            }

            const updatedComment = await commentService.updateComment(commentId, nickname, content, password);

            if (!updatedComment) {
                return res.status(404).json({ message: '존재하지 않습니다.' });
            }
            return res.status(200).json(updatedComment);
        } catch (error) {
            if (error.message === '비밀번호가 틀렸습니다.') {
                return res.status(403).json({ message: error.message });
            }
            console.error(error);
            return res.status(500).json({ message: '서버 오류입니다.' });
        }
    }

    // 댓글 삭제
    async deleteComment(req, res) {
        const { commentId } = req.params;
        const { password } = req.body;

        if (!password || !commentId) {
            return res.status(400).json({ message: '잘못된 요청입니다.' });
        }

        try {
            const result = await commentService.deleteComment(commentId, password);

            if (result === "NOT_FOUND") {
                return res.status(404).json({ message: '존재하지 않습니다' });
            } else if (result === "FORBIDDEN") {
                return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
            }
            return res.status(200).json({ message: '댓글 삭제 성공' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '서버 오류' });
        }
    }

    // 댓글 목록 조회
    async getComments(req, res) {
        const { postId } = req.params;
        const { page = 1, pageSize = 10 } = req.query;

        if (!postId || isNaN(page) || isNaN(pageSize)) {
            return res.status(400).json({ message: '잘못된 요청입니다.' });
        }

        try {
            const commentData = await commentService.getComments(postId, parseInt(page, 10), parseInt(pageSize, 10));
            return res.status(200).json(commentData);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: '서버 오류' });
        }
    }
}

export default new CommentController();
