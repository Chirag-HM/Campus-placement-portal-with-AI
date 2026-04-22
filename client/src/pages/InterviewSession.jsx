import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { useSocket } from '@/hooks/useSocket';
import { Send, Loader2, ChevronRight, Lightbulb, CheckCircle, Trophy, ArrowLeft } from 'lucide-react';

export default function InterviewSession() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const [session, setSession] = useState(location.state || null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalReport, setFinalReport] = useState(null);

  useEffect(() => {
    if (!session) {
      api.get(`/interview/${id}`).then(r => setSession(r.data.session)).catch(() => navigate('/interview'));
    }
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join-interview', id);
    socket.on('interview-update', (data) => {
      if (data.sessionId === id) setEvaluation(data.evaluation);
    });
    return () => { socket.off('interview-update'); };
  }, [socket, id]);

  const questions = session?.questions || [];
  const currentQuestion = questions[currentQ];

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true); setEvaluation(null);
    try {
      const { data } = await api.post('/interview/answer', {
        sessionId: session.sessionId || id,
        questionId: currentQuestion.id,
        userAnswer: answer,
      });
      setEvaluation(data.evaluation);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setAnswer(''); setEvaluation(null); setShowHint(false);
    }
  };

  const handleComplete = async () => {
    try {
      const { data } = await api.post('/interview/complete', { sessionId: session.sessionId || id });
      setFinalReport(data.session);
      setCompleted(true);
    } catch { /* ignore */ }
  };

  if (!session) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (completed && finalReport) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Interview Complete!</h1>
          <p className="text-text-secondary mb-6">Here's your performance summary</p>

          <div className="w-32 h-32 mx-auto mb-6 relative">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <motion.circle cx="64" cy="64" r="56" stroke={finalReport.totalScore >= 70 ? '#10B981' : finalReport.totalScore >= 40 ? '#F59E0B' : '#EF4444'}
                strokeWidth="8" fill="none" strokeLinecap="round"
                initial={{ strokeDashoffset: 352 }} animate={{ strokeDashoffset: 352 - (finalReport.totalScore / 100) * 352 }}
                transition={{ duration: 1.5, ease: 'easeOut' }} strokeDasharray="352" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl font-bold">{finalReport.totalScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className="glass-card p-3"><p className="text-text-muted text-xs">Role</p><p className="font-medium">{finalReport.role}</p></div>
            <div className="glass-card p-3"><p className="text-text-muted text-xs">Difficulty</p><p className="font-medium">{finalReport.difficulty}</p></div>
            <div className="glass-card p-3"><p className="text-text-muted text-xs">Round</p><p className="font-medium">{finalReport.roundType}</p></div>
          </div>

          <div className="space-y-3 text-left max-h-96 overflow-y-auto">
            {finalReport.answers?.map((a, i) => (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Q{a.questionId}</p>
                  <span className={`badge ${a.score >= 7 ? 'badge-green' : a.score >= 4 ? 'badge-yellow' : 'badge-red'}`}>{a.score}/10</span>
                </div>
                <p className="text-text-secondary text-xs">{a.feedback}</p>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/interview')} className="btn-primary mt-6">Practice Again</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/interview')} className="btn-secondary text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentQ ? 'bg-primary' : i < currentQ ? 'bg-emerald' : 'bg-white/10'}`} />
          ))}
        </div>
        <span className="text-text-secondary text-sm font-medium">{currentQ + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }} className="space-y-6">
          {/* Question */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="badge badge-purple">Question {currentQ + 1}</span>
              {currentQuestion?.expectedTopics?.length > 0 && (
                <div className="flex gap-1">
                  {currentQuestion.expectedTopics.map(t => <span key={t} className="badge badge-blue text-[10px]">{t}</span>)}
                </div>
              )}
            </div>
            <h2 className="font-display text-lg font-semibold leading-relaxed">{currentQuestion?.question}</h2>

            {currentQuestion?.hint && (
              <button onClick={() => setShowHint(!showHint)} className="mt-3 flex items-center gap-1 text-yellow-400 text-xs hover:underline">
                <Lightbulb className="w-3 h-3" /> {showHint ? 'Hide hint' : 'Show hint'}
              </button>
            )}
            {showHint && <p className="mt-2 text-text-muted text-sm italic">{currentQuestion.hint}</p>}
          </div>

          {/* Answer */}
          <div className="glass-card p-6">
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="input-field h-36 resize-none mb-4" disabled={!!evaluation} />
            {!evaluation ? (
              <button onClick={handleSubmit} disabled={!answer.trim() || submitting}
                className="btn-primary w-full justify-center py-3 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating...</> : <><Send className="w-5 h-5" /> Submit Answer</>}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display text-lg font-bold
                    ${evaluation.score >= 7 ? 'bg-emerald-500/20 text-emerald-400' : evaluation.score >= 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {evaluation.score}/10
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Feedback</p>
                    <p className="text-text-secondary text-sm">{evaluation.feedback}</p>
                  </div>
                </div>

                {evaluation.improvedAnswer && (
                  <div className="glass-card bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold text-emerald-400 mb-1">Model Answer</p>
                    <p className="text-text-secondary text-sm">{evaluation.improvedAnswer}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {currentQ < questions.length - 1 ? (
                    <button onClick={nextQuestion} className="btn-primary flex-1 justify-center">
                      Next Question <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={handleComplete} className="btn-primary flex-1 justify-center bg-gradient-to-r from-emerald-500 to-teal-500">
                      <CheckCircle className="w-5 h-5" /> Complete Interview
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
