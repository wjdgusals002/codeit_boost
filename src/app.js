// src/app.js

import express from 'express';
import groupRoutes from './routes/groupRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();

const upload= multer({dest:'src/uploads'});


const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.use(express.json());

// 요청 로깅 미들웨어 추가
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    next();
});

// 정적 파일 제공을 위한 미들웨어 추가
app.use('/uploads', express.static('src/uploads'));


app.use('/api', groupRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', badgeRoutes);
app.use('/api/image', imageRoutes);

app.get('/', (req, res) => {
    try {
      // 정상적인 요청 처리 로직
      res.send('Hello, world!');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

//서버 연결 확인
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  });

  app.post('/image', upload.single('file'), (req, res) => {
    console.log(req.file); // 업로드된 파일 정보
    console.log(req.body); // 기타 폼 데이터
    res.send('File uploaded successfully');
  });

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
