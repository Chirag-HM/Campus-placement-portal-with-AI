import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { GraduationCap, Loader2, CheckCircle, Circle, ExternalLink, Book, Video, Code, FileText, Sparkles } from 'lucide-react';

const typeIcons = { video: Video, article: FileText, course: Book, documentation: FileText, practice: Code };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) };

export default function LearningPath() {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [currentLevel, setCurrentLevel] = useState('beginner');

  useEffect(() => {
    api.get('/learning/my-path').then(r => setPath(r.data.learningPath)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    if (!targetRole) return;
    setGenerating(true);
    try {
      const { data } = await api.post('/learning/generate', { targetRole, currentLevel });
      setPath(data.learningPath);
    } catch { /* ignore */ }
    finally { setGenerating(false); }
  };

  const toggleWeek = async (week, isCompleted) => {
    try {
      const { data } = await api.patch('/learning/progress', { week, isCompleted });
      setPath(data.learningPath);
    } catch { /* ignore */ }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-2"><span className="gradient-text">Learning Path</span></h1>
        <p className="text-text-secondary mb-8">Personalised roadmap to bridge your skill gaps</p>
      </motion.div>

      {!path ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 max-w-lg mx-auto space-y-6">
          <div className="text-center mb-4">
            <GraduationCap className="w-16 h-16 text-emerald mx-auto mb-3" />
            <h2 className="font-display text-xl font-semibold">Generate Your Learning Path</h2>
            <p className="text-text-secondary text-sm mt-1">AI will create an 8-week roadmap based on your skill gaps</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Role</label>
            <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Level</label>
            <div className="flex gap-3">
              {['beginner', 'intermediate', 'advanced'].map(l => (
                <button key={l} onClick={() => setCurrentLevel(l)}
                  className={`flex-1 p-3 rounded-xl text-sm font-medium capitalize transition-all
                    ${currentLevel === l ? 'bg-emerald/20 border border-emerald text-white' : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!targetRole || generating}
            className="btn-primary w-full justify-center py-3 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Path</>}
          </button>
        </motion.div>
      ) : (
        <div>
          {/* Progress Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-display font-semibold">{path.targetRole}</h2>
                <p className="text-text-secondary text-sm capitalize">{path.currentLevel} level</p>
              </div>
              <span className="font-display text-2xl font-bold gradient-text">{path.overallProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${path.overallProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            </div>
          </motion.div>

          {/* Roadmap */}
          <div className="space-y-4">
            {path.roadmap?.map((week, i) => {
              const Icon = week.isCompleted ? CheckCircle : Circle;
              return (
                <motion.div key={week.week} custom={i} initial="hidden" animate="visible" variants={fadeUp}
                  className={`glass-card p-6 transition-all ${week.isCompleted ? 'opacity-70' : ''}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleWeek(week.week, !week.isCompleted)}
                      className="mt-0.5 shrink-0">
                      <Icon className={`w-6 h-6 ${week.isCompleted ? 'text-emerald' : 'text-text-muted hover:text-primary'} transition-colors`} />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display font-semibold">Week {week.week}: {week.focus}</h3>
                        <span className="badge badge-blue text-[10px]">Week {week.week}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {week.topics?.map(t => <span key={t} className="badge badge-purple text-[10px]">{t}</span>)}
                      </div>

                      {week.resources?.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {week.resources.map((r, ri) => {
                            const RIcon = typeIcons[r.type] || FileText;
                            return (
                              <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group">
                                <RIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="group-hover:underline">{r.title}</span>
                                <span className="text-text-muted text-xs">({r.platform})</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {week.milestone && (
                        <p className="text-text-muted text-xs italic">🎯 {week.milestone}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button onClick={() => { setPath(null); setTargetRole(''); }}
            className="btn-secondary mt-8 mx-auto flex">Generate New Path</button>
        </div>
      )}
    </div>
  );
}
