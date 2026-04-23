import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileText, Briefcase, MessageSquare, Map, User, Bell, LogIn, BrainCircuit, ChevronDown, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, clearNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resume AI', path: '/resume', icon: FileText },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Tracker', path: '/tracker', icon: CheckCircle },
    { label: 'Interview Prep', path: '/interview', icon: MessageSquare },
    { label: 'Learning Path', path: '/learning', icon: Map },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/40 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
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

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-1">
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-5">
            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2.5 transition-all rounded-xl border ${
                      notifications.length > 0 ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-text-secondary hover:text-white'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-dark-950 shadow-glow shadow-primary/50" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-[calc(100vw-32px)] sm:w-80 glass-card p-4 z-20 shadow-2xl origin-top-right"
                        >
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                            <h3 className="font-display font-bold text-white">Notifications</h3>
                            <button onClick={clearNotifications} className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors">
                              Clear All
                            </button>
                          </div>

                          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="py-8 text-center space-y-2">
                                <Bell className="w-8 h-8 text-white/10 mx-auto" />
                                <p className="text-xs text-text-muted">No new notifications</p>
                              </div>
                            ) : (
                              notifications.map((n) => (
                                <Link 
                                  key={n.id} 
                                  to={n.link} 
                                  onClick={() => setShowNotifications(false)}
                                  className="flex flex-col gap-1 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group text-left"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{n.title}</span>
                                    <span className="text-[9px] text-text-muted">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <p className="text-xs text-white leading-relaxed group-hover:text-primary transition-colors">{n.message}</p>
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

                <div className="flex items-center gap-2 sm:gap-4">
                  <Link to="/profile" className="flex items-center gap-3 p-1 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group lg:pr-4">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      className="w-9 h-9 rounded-xl border border-white/10 group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="hidden lg:block">
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.name.split(' ')[0]}</p>
                      <p className="text-[9px] text-text-muted uppercase tracking-widest font-black">{user.role}</p>
                    </div>
                  </Link>
                  
                  {/* Mobile Menu Toggle */}
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2.5 text-text-secondary hover:text-white bg-white/5 rounded-xl border border-white/5"
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  <button onClick={logout} className="hidden sm:flex p-2.5 text-text-muted hover:text-red-400 transition-all bg-white/5 rounded-xl border border-white/5 hover:border-red-500/20">
                    <LogIn className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-white px-4 py-2 transition-colors">
                  Sign In
                </Link>
                <Link to="/login" className="btn-primary py-2.5 px-4 sm:px-8 text-sm shadow-xl shadow-primary/20">
                  <span className="sm:inline hidden">Get Started</span>
                  <span className="sm:hidden inline">Join</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-dark-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {user && navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 border border-primary/20 text-white' 
                      : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-primary' : ''}`} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
              {user && (
                <button 
                  onClick={logout}
                  className="flex items-center gap-4 p-4 w-full rounded-2xl text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
                >
                  <LogIn className="w-5 h-5 rotate-180" />
                  <span className="font-semibold">Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
