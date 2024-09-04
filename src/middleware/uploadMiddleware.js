import multer from 'multer';
import path from 'path';

// 이미지 저장 위치와 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads'); // 'uploads' 디렉토리에 저장
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now()+path.extname(file.originalname)); // 고유 파일명 생성
  },
});

const upload = multer({ storage :storage});

export default upload;
