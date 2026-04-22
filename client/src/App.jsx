import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import AuthCallback from '@/pages/AuthCallback';
import Dashboard from '@/pages/Dashboard';
import ResumeAnalyser from '@/pages/ResumeAnalyser';
import JobBoard from '@/pages/JobBoard';
import JobDetail from '@/pages/JobDetail';
import InterviewPrep from '@/pages/InterviewPrep';
import InterviewSession from '@/pages/InterviewSession';
import LearningPath from '@/pages/LearningPath';
import Profile from '@/pages/Profile';
import RecruiterDashboard from '@/pages/RecruiterDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AIAssistant from '@/components/AIAssistant';


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-dark-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/resume" element={<ProtectedRoute><ResumeAnalyser /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
              <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
              <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
              <Route path="/interview/:id" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
              <Route path="/learning" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/recruiter" element={<ProtectedRoute roles={['recruiter', 'admin']}><RecruiterDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            </Routes>
            <AIAssistant />
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
