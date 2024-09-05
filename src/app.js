//express 서버를 설정하고 라우터를 연결하고, 서버 시작

// src/routes/groupRoutes.js
import express from 'express';
import groupRoutes from './routes/groupRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import cors from 'cors';

const app= express();

app.use(cors({
    origin: 'https://project-zogakzip-fe.vercel.app/?baseUrl=',
    methods: 'GET,POST,PUT,DELETE', // 허용할 HTTP 메소드
    allowedHeaders: 'Content-Type,Authorization', // 허용할 헤더
    credentials: true,
    }));

app.use(express.json());

// 정적 파일 제공을 위한 미들웨어 추가
app.use('/uploads', express.static('src/uploads'));

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
  });
   


app.use('/api',groupRoutes);
app.use('/api',postRoutes);
app.use('/api',commentRoutes);
app.use('/api',badgeRoutes);
app.use('/api/image',imageRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
server.setTimeout(10 * 60 * 1000); 
