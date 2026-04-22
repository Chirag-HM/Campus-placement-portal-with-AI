import { Router } from 'express';
import { updateProfile, getAllUsers, updateUserRole, getDashboardStats } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.patch('/profile', verifyToken, updateProfile);
router.get('/all', verifyToken, requireRole('admin'), getAllUsers);
router.patch('/role', verifyToken, requireRole('admin'), updateUserRole);
router.get('/dashboard-stats', verifyToken, getDashboardStats);
router.post('/ai-coach', verifyToken, (req, res, next) => {
  // We'll define the controller function next
  import('../controllers/userController.js').then(ctrl => ctrl.aiCoach(req, res)).catch(next);
});

export default router;
