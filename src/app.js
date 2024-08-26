//express 서버를 설정하고 라우터를 연결하고, 서버 시작

// src/routes/groupRoutes.js
import express from 'express';
import groupRoutes from './routes/groupRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';

const app= express();
app.use(express.json());

app.use('/api',groupRoutes);
app.use('/api',postRoutes);
app.use('/api',commentRoutes);
app.use('/api',badgeRoutes);

const PORT= process.env.PORT ||3000;
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
});
