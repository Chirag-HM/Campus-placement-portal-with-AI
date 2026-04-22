import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import configurePassport from './services/passportService.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import jobRoutes from './routes/jobs.js';
import interviewRoutes from './routes/interview.js';
import learningRoutes from './routes/learning.js';
import userRoutes from './routes/user.js';

const app = express();
const server = createServer(app);

// ─── Socket.io Setup ────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket connection tracking
const userSockets = new Map();

// Socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token provided'));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Unauthorized'));
    socket.userId = decoded.id;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.userId}`);
  userSockets.set(socket.userId, socket.id);

  socket.on('join-interview', (roomId) => {
    socket.join(roomId);
    console.log(`👤 User ${socket.userId} joined interview room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    userSockets.delete(socket.userId);
    console.log(`🔌 User disconnected: ${socket.userId}`);
  });
});

// Export helpers for controllers
export const getIO = () => io;
export const getUserSocket = (userId) => userSockets.get(userId);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── MongoDB + Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
