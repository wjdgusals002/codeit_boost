import express from 'express';
import badgeController from '../controllers/badgeController.js';

const router = express.Router();

router.post('/groups/:groupId/badges',badgeController.checkAndAwardBadges);

export default router;
