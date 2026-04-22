import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Map, User, Bell, LogIn, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout, loginWithGoogle } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resume AI', path: '/resume', icon: FileText },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Interview Prep', path: '/interview', icon: MessageSquare },
    { label: 'Learning Path', path: '/learning', icon: Map },
  ];

  const isAdmin = user?.role === 'admin';
  const isRecruiter = user?.role === 'recruiter' || isAdmin;

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Place<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-white/10 text-white'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button className="p-2 text-text-secondary hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-dark-900" />
                </button>
                
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      className="w-9 h-9 rounded-xl border-2 border-white/10 group-hover:border-primary transition-all" 
                    />
                    <div className="hidden sm:block">
                      <p className="text-sm font-bold leading-tight">{user.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">{user.role}</p>
                    </div>
                  </Link>
                  <button onClick={logout} className="p-2 text-text-muted hover:text-red-400 transition-colors">
                    <LogIn className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-white px-4 py-2">
                  Sign In
                </Link>
                <Link to="/login" className="btn-primary py-2 px-6">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
