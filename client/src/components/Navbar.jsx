import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Map, User, Bell, LogIn, BrainCircuit, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resume AI', path: '/resume', icon: FileText },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Interview Prep', path: '/interview', icon: MessageSquare },
    { label: 'Learning Path', path: '/learning', icon: Map },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/40 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:rotate-6 transition-all duration-500">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight leading-none">
                Place<span className="gradient-text">AI</span>
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Portal v2.0</span>
            </div>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {user && navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/10 rounded-xl -z-10 border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <button className="relative p-2.5 text-text-secondary hover:text-white transition-all bg-white/5 rounded-xl border border-white/5 hover:border-white/10">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-dark-950 shadow-glow shadow-primary/50" />
                </button>
                
                <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      className="w-9 h-9 rounded-xl border border-white/10 group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="hidden lg:block">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.name.split(' ')[0]}</p>
                      <p className="text-[9px] text-text-muted uppercase tracking-widest font-black">{user.role}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-text-muted group-hover:text-white transition-colors" />
                  </Link>
                  <button onClick={logout} className="p-2.5 text-text-muted hover:text-red-400 transition-all bg-white/5 rounded-xl border border-white/5 hover:border-red-500/20">
                    <LogIn className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-white px-4 py-2 transition-colors">
                  Sign In
                </Link>
                <Link to="/login" className="btn-primary py-2.5 px-8 text-sm shadow-xl shadow-primary/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
