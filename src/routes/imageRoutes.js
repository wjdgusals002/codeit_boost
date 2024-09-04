import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import imageController from '../controllers/imageController.js';

const router = express.Router();

// 이미지 업로드를 처리하는 POST 요청 라우트
router.post('/', upload.single('image'), imageController.uploadImage);

export default router;
