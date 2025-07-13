import { Router } from 'express';

import authMiddleware from '../middlewares/auth.middleware';

import authRoutes from './auth.routes';
import pollRoutes from './poll.routes';
import voteRoutes from './vote.routes';


const router = Router();

router.use('/auth', authRoutes);
router.use('/polls', authMiddleware, pollRoutes);
router.use('/votes', authMiddleware, voteRoutes);

export default router;
