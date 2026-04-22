import { motion } from 'framer-motion';
import { LogIn, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

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
            Accelerate Your <br />
            <span className="gradient-text">Career Journey</span>
          </h2>
          
          <p className="text-slate-400 text-lg mb-8">
            Join the elite community using AI to transform their career path and hiring process.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              </div>
              <span>Secure Authentication via Google</span>
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
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-display font-bold mb-2 text-white">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your account</p>
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="space-y-4 opacity-40 grayscale">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-xl text-white outline-none cursor-not-allowed"
              disabled 
            />
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-slate-500 cursor-not-allowed">
              Sign in with Email
            </button>
          </div>

          <p className="mt-8 text-center text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">
            By signing in, you agree to our <br />
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span> & <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
