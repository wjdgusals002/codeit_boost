//게시글 관련 라우트
import express from 'express';
import postController from '../controllers/postController.js';

const router = express.Router({mergeParams:true});

//특정 그룹에 게시글 등록
router.post('/groups/:groupid/posts',postController.createPost);

//특정 그룹의 게시글 목록 조회
router.get('/groups/:groupid/posts', postController.getPostsByGroupId);

//특정 게시글 수정
router.put('/:postId',postController.updatePost);

//특정 게시글 삭제
router.delete('/:postId',postController.deletePost);

//특정 게시글 상세 정보 조회
router.get('/:postId',postController.getPostDetails);

//게시글 조화 권한 확인
router.post('/:postId/verify-password',postController.verifyPostPassword);

//게시글 공감하기
router.post('/posts/:postId/like',postController.likePost);

//게시글 공개 여부 확인하기
router.get('/posts/:postId/is-public',postController.isPublic);

export default router;