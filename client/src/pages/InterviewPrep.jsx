import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { MessageSquare, Loader2, Zap } from 'lucide-react';

const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'UI/UX Designer', 'Product Manager'];
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-2"><span className="gradient-text">AI Interview Prep</span></h1>
        <p className="text-text-secondary mb-8">Practice with AI-generated questions and get real-time feedback</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Select Role</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`p-3 rounded-xl text-sm font-medium text-left transition-all
                  ${role === r ? 'bg-primary/20 border border-primary text-white' : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Difficulty</label>
          <div className="flex gap-3">
            {difficulties.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all
                  ${difficulty === d ? 'bg-primary/20 border border-primary text-white' : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Round Type</label>
          <div className="flex flex-wrap gap-2">
            {roundTypes.map(rt => (
              <button key={rt} onClick={() => setRoundType(rt)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${roundType === rt ? 'bg-primary/20 border border-primary text-white' : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'}`}>
                {rt}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleStart} disabled={!role || loading}
          className="btn-primary w-full justify-center py-3.5 text-lg disabled:opacity-50">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Questions...</>
            : <><Zap className="w-5 h-5" /> Start Interview</>}
        </button>
      </motion.div>
    </div>
  );
}
