import { Router } from 'express';
import { updateProfile, getAllUsers, updateUserRole, getDashboardStats, aiCoach } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.patch('/profile', verifyToken, updateProfile);
router.get('/all', verifyToken, requireRole('admin'), getAllUsers);
router.patch('/role', verifyToken, requireRole('admin'), updateUserRole);
router.get('/dashboard-stats', verifyToken, getDashboardStats);
router.post('/ai-coach', verifyToken, aiCoach);

export default router;
