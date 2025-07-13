import { Router } from 'express';
import { poll, getPolls, getPollByIdDetailed } from '../controllers/poll.controller';
// createPoll
const router = Router();

router.post('/', poll);

router.get('/', getPolls);

router.get('/:id', getPollByIdDetailed);

export default router;
