import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { MessageSquare, Loader2, Zap, BrainCircuit, Code, Users, Monitor, Smartphone, Palette, Terminal, Layout } from 'lucide-react';

const roleIcons = {
  'Frontend Developer': Layout,
  'Backend Developer': Terminal,
  'Full Stack Developer': Code,
  'Data Scientist': BrainCircuit,
  'DevOps Engineer': Monitor,
  'Mobile Developer': Smartphone,
  'UI/UX Designer': Palette,
  'Product Manager': Users
};

const difficulties = ['Easy', 'Medium', 'Hard'];
const roundTypes = ['Technical', 'HR', 'DSA', 'System Design', 'Behavioral'];

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [roundType, setRoundType] = useState('Technical');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const { data } = await api.post('/interview/start', { role, difficulty, roundType });
      navigate(`/interview/${data.sessionId}`, { state: data });
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Zap className="w-3 h-3" /> AI Simulator
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Configure Your <span className="gradient-text">Mock Round</span>
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          Tailor your interview experience by selecting your target role and difficulty. Our AI will generate specialized questions for you.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Role Selection */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <h2 className="font-display text-xl font-bold mb-6">1. Choose Target Role</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(roleIcons).map(([r, Icon]) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 group
                    ${role === r ? 'bg-primary/20 border-primary shadow-glow shadow-primary/20' : 'bg-white/5 border border-white/5 hover:border-white/20'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${role === r ? 'bg-primary text-white' : 'bg-white/5 text-text-muted group-hover:text-white'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${role === r ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>{r}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Industry Standard</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Settings */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
          <div className="glass-card p-8 space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold mb-4">2. Difficulty</h2>
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                {difficulties.map(d => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all
                      ${difficulty === d ? 'bg-white/10 text-white shadow-sm' : 'text-text-muted hover:text-white'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold mb-4">3. Round Type</h2>
              <div className="space-y-2">
                {roundTypes.map(rt => (
                  <button key={rt} onClick={() => setRoundType(rt)}
                    className={`w-full p-4 rounded-xl text-left text-sm font-bold transition-all border
                      ${roundType === rt ? 'bg-primary/10 border-primary/50 text-white' : 'bg-white/5 border-white/5 text-text-muted hover:text-white hover:border-white/10'}`}>
                    {rt} Round
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleStart} disabled={!role || loading}
              className="btn-primary w-full py-4 text-sm shadow-xl shadow-primary/20 group">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing AI...</>
                : <><Zap className="w-5 h-5 group-hover:scale-125 transition-transform" /> Start Interview</>}
            </button>

            <p className="text-[10px] text-text-muted text-center italic">
              Estimated duration: 15-20 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
