import { Router } from 'express';
import { updateProfile, getAllUsers, updateUserRole, getDashboardStats, aiCoach, addExternalApplication, updateExternalApplication, deleteExternalApplication } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.patch('/profile', verifyToken, updateProfile);
router.get('/all', verifyToken, requireRole('admin'), getAllUsers);
router.patch('/role', verifyToken, requireRole('admin'), updateUserRole);
router.get('/dashboard-stats', verifyToken, getDashboardStats);
router.post('/ai-coach', verifyToken, aiCoach);

router.post('/external-apps', verifyToken, addExternalApplication);
router.patch('/external-apps/:id', verifyToken, updateExternalApplication);
router.delete('/external-apps/:id', verifyToken, deleteExternalApplication);

export default router;
