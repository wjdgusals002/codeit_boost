//게시글 관련 라우트
import express from 'express';
import postController from '../controllers/postController.js';
import multer from 'multer';


const router = express.Router({mergeParams:true});

// multer 설정
const upload = multer({ dest: 'uploads/' });

// 특정 그룹에 게시글 등록 (파일 업로드 포함)
router.post('/groups/:groupid/posts', upload.single('file'), postController.createPost);

//특정 그룹에 게시글 등록
// router.post('/groups/:groupid/posts',postController.createPost);

//특정 그룹의 게시글 목록 조회
router.get('/groups/:groupid/posts', postController.getPostsByGroupId);

//특정 게시글 수정
router.put('/posts/:postId',postController.updatePost);

//특정 게시글 삭제
router.delete('/posts/:postId',postController.deletePost);

//특정 게시글 상세 정보 조회
router.get('/posts/:postId',postController.getPostDetails);

//게시글 공감하기
router.post('/posts/:postId/like',postController.incrementLike);

//게시글 조화 권한 확인
router.post('/posts/:postId/verify-password',postController.verifyPostPassword);

//게시글 공개 여부 확인하기
router.get('/posts/:postId/is-public',postController.isPublic);


export default router;