//클라이언트 초기화, 데이터베이스 연결
// prismaClient.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
