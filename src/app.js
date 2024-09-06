// src/app.js

import express from 'express';
import groupRoutes from './routes/groupRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'https://project-zogakzip-fe.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
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

app.get('/', (req, res) => {
    console.log('Request received:', req.method, req.url);
    res.send('Welcome to the server!');
});

app.use('/api', groupRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', badgeRoutes);
app.use('/api/image', imageRoutes);

//서버 연결 확인
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  });

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
