import { Router } from 'express';
import { vote } from '../controllers/vote.controller';
// createPoll
const router = Router();

router.post('/', vote);


export default router;
