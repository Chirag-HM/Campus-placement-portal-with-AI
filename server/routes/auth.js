import { Router } from 'express';
import passport from 'passport';
import { googleCallback, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

router.get('/me', verifyToken, getMe);

export default router;
