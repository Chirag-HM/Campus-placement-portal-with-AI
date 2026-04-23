import { Router } from 'express';
import { generatePath, updateProgress, getMyPath, getCourses, getCourseById, completeCourse } from '../controllers/learningController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/generate', verifyToken, generatePath);
router.patch('/progress', verifyToken, updateProgress);
router.get('/my-path', verifyToken, getMyPath);

router.get('/courses', verifyToken, getCourses);
router.get('/courses/:id', verifyToken, getCourseById);
router.post('/courses/complete', verifyToken, completeCourse);

export default router;
