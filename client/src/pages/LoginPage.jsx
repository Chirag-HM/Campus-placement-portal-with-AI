import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Sparkles, ShieldCheck, Zap, Mail, Lock, User as UserIcon, Loader2, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AICaptcha from '@/components/AICaptcha';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { loginWithGoogle, emailLogin, emailRegister } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return;
    setLoading(true);
    setError('');
    
    try {
      if (isRegister) {
        await emailRegister(formData.name, formData.email, formData.password, formData.role);
      } else {
        await emailLogin(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl z-10"
      >
        {/* Left Section: Visuals */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-r border-white/5">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30 mb-8"
          >
            <Sparkles className="w-8 h-8 text-blue-400" />
          </motion.div>
          
          <h2 className="text-4xl font-display font-bold leading-tight mb-4">
            {isRegister ? "Start Your" : "Accelerate Your"} <br />
            <span className="gradient-text">{isRegister ? "New Future" : "Career Journey"}</span>
          </h2>
          
          <p className="text-slate-400 text-lg mb-8">
            Join the elite community using AI to transform their career path and hiring process.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </div>
              <span>Secure Authentication via Neural Protocol</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-3 h-3 text-blue-400" />
              </div>
              <span>Instant Dashboard Access</span>
            </div>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-slate-900/40">
          <div className="text-center lg:text-left mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2 text-white">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
              <p className="text-slate-400">{isRegister ? 'Begin your AI-powered journey' : 'Sign in to your account'}</p>
            </div>
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>

          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-2xl transition-all transform active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 text-slate-500 py-8">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Access</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['student', 'recruiter'].map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({...formData, role})}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                          ${formData.role === role ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                placeholder="Email address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                placeholder="Password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <AICaptcha onVerify={setIsVerified} />

            {error && (
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
            )}

            <button 
              type="submit"
              disabled={!isVerified || loading}
              className="btn-primary w-full py-4 text-sm shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>
                  {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {isRegister ? 'Create AI Profile' : 'Sign in to Portal'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
            By signing in, you agree to our <br />
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span> & <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
