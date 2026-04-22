import { Router } from 'express';
import { generatePath, updateProgress, getMyPath } from '../controllers/learningController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/generate', verifyToken, generatePath);
router.patch('/progress', verifyToken, updateProgress);
router.get('/my-path', verifyToken, getMyPath);

export default router;
