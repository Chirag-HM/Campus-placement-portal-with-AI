import { Router } from 'express';
import { startInterview, submitAnswer, completeInterview, getSession, getHistory } from '../controllers/interviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/start', verifyToken, startInterview);
router.post('/answer', verifyToken, submitAnswer);
router.post('/complete', verifyToken, completeInterview);
router.get('/history', verifyToken, getHistory);
router.get('/:id', verifyToken, getSession);

export default router;
