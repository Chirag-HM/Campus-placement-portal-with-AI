import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { useSocket } from '@/hooks/useSocket';
import { Send, Loader2, ChevronRight, Lightbulb, CheckCircle, Trophy, ArrowLeft, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';


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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Speech Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setAnswer(transcript);
    };
    recognition.onend = () => setIsListening(false);
  }

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoSpeak && currentQuestion?.question) {
      speakQuestion(currentQuestion.question);
    }
  }, [currentQ, autoSpeak]);

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
        language: session.roundType?.toLowerCase().includes('technical') ? 'javascript' : null
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

  const [levelUpData, setLevelUpData] = useState(null);

  const handleComplete = async () => {
    try {
      const { data } = await api.post('/interview/complete', { sessionId: session.sessionId || id });
      setFinalReport(data.session);
      setCompleted(true);
      if (data.xpResult?.leveledUp) {
        setLevelUpData(data.xpResult);
      }
    } catch { /* ignore */ }
  };

  if (!session) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-text-muted font-display font-medium">Initializing Interview Environment...</p>
    </div>
  );

  if (completed && finalReport) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence>
          {levelUpData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-md p-6"
            >
              <div className="glass-card p-12 text-center max-w-md relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 pulse-glow -z-10" />
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-glow" />
                </motion.div>
                <h2 className="text-4xl font-display font-black mb-2">LEVEL UP!</h2>
                <p className="text-primary font-bold text-lg mb-6">You've reached Level {levelUpData.level}</p>
                <p className="text-text-secondary mb-8">Your placement readiness is increasing. New opportunities await!</p>
                <button onClick={() => setLevelUpData(null)} className="btn-primary w-full py-4">Awesome!</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6 drop-shadow-glow" />
          <h1 className="font-display text-4xl font-bold mb-3">Interview <span className="gradient-text">Complete!</span></h1>
          <p className="text-text-secondary mb-10 text-lg">Your performance report is ready for review.</p>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="relative inline-flex items-center justify-center">
              <svg width="200" height="200" className="-rotate-90">
                <circle cx="100" cy="100" r="85" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                <motion.circle cx="100" cy="100" r="85" stroke={finalReport.totalScore >= 70 ? '#10B981' : finalReport.totalScore >= 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="12" fill="none" strokeLinecap="round"
                  initial={{ strokeDashoffset: 534 }} animate={{ strokeDashoffset: 534 - (finalReport.totalScore / 100) * 534 }}
                  transition={{ duration: 2, ease: 'backOut' }} strokeDasharray="534" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-5xl font-black">{finalReport.totalScore}%</span>
                <span className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">Aggregate Score</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6 flex items-center justify-between bg-white/5">
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Target Role</p>
                <p className="font-display font-bold text-white">{finalReport.role}</p>
              </div>
              <div className="glass-card p-6 flex items-center justify-between bg-white/5">
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Difficulty</p>
                <span className="badge badge-purple">{finalReport.difficulty}</span>
              </div>
              <div className="glass-card p-6 flex items-center justify-between bg-white/5">
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Round Type</p>
                <p className="font-display font-bold text-white">{finalReport.roundType}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-left mb-10">
            <h3 className="font-display text-xl font-bold px-2">Detailed Breakdown</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {finalReport.answers?.map((a, i) => (
                <div key={i} className="glass-card p-6 hover:bg-white/5 transition-colors border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black">Q{i + 1}</div>
                      <p className="text-sm font-bold">Concept Analysis</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-black 
                      ${a.score >= 7 ? 'bg-emerald-500/10 text-emerald-400' : a.score >= 4 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                      {a.score}/10
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{a.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => navigate('/interview')} className="btn-primary flex-1 py-5 shadow-2xl">
              Start New Simulation
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-10 py-5 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-all">
              Exit to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Session Navigation */}
      <div className="flex items-center justify-between mb-10 bg-white/5 p-4 rounded-2xl border border-white/5">
        <button onClick={() => navigate('/interview')} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Cancel Session
        </button>
        
        <div className="flex items-center gap-3">
          {questions.map((_, i) => (
            <div key={i} className="relative group">
              <div className={`w-8 h-1.5 rounded-full transition-all duration-500 
                ${i === currentQ ? 'bg-primary w-12 shadow-glow shadow-primary/50' : i < currentQ ? 'bg-emerald-500' : 'bg-white/10'}`} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-900 border border-white/10 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                Q{i+1}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm tracking-tighter">{currentQ + 1}</span>
          <span className="text-text-muted text-xs font-bold uppercase tracking-widest">/ {questions.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} className="grid lg:grid-cols-5 gap-8 items-start">
          
          {/* Question Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <span className="badge badge-purple py-1 px-3">Question {currentQ + 1}</span>
                <button 
                  onClick={() => {
                    setAutoSpeak(!autoSpeak);
                    if (!autoSpeak) speakQuestion(currentQuestion.question);
                    else window.speechSynthesis.cancel();
                  }}
                  className={`p-3 rounded-xl transition-all shadow-lg ${autoSpeak ? 'bg-primary text-white' : 'bg-white/5 text-text-muted'}`}
                >
                  {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
              
              <h2 className="font-display text-2xl font-bold leading-snug mb-8">
                {currentQuestion?.question}
                {isSpeaking && (
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="ml-3 inline-flex gap-1"
                  >
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                  </motion.span>
                )}
              </h2>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {currentQuestion?.expectedTopics?.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
                
                {currentQuestion?.hint && (
                  <div className="pt-6 border-t border-white/5">
                    <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:text-yellow-400 transition-colors">
                      <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Conceal Prompt' : 'Reveal Prompt'}
                    </button>
                    <AnimatePresence>
                      {showHint && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="mt-3 text-text-secondary text-xs italic leading-relaxed bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                          {currentQuestion.hint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/10 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                 <CheckCircle className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                 <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">AI Status</p>
                 <p className="text-sm font-bold text-white">Analyzing your intent...</p>
               </div>
            </div>
          </div>

          {/* Input Side */}
          <div className="lg:col-span-3">
            <div className="glass-card p-8 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl">Your Response</h3>
                <div className="flex gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {session.roundType?.toLowerCase().includes('technical') ? (
                  <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 bg-dark-950 min-h-[400px]">
                    <CodeEditor 
                      value={answer} 
                      onChange={(v) => setAnswer(v)} 
                      language="javascript" 
                    />
                  </div>
                ) : (
                  <div className="relative flex-1">
                    <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Articulate your response here..."
                      className="w-full h-full min-h-[300px] bg-transparent text-lg leading-relaxed resize-none focus:outline-none placeholder:text-text-muted" 
                      disabled={!!evaluation} 
                    />
                    
                    {!evaluation && (
                      <button 
                        onClick={toggleListening}
                        className={`absolute right-0 bottom-0 p-5 rounded-2xl transition-all shadow-2xl ${
                          isListening ? 'bg-red-500 text-white shadow-red-500/40' : 'bg-white/5 text-text-secondary hover:bg-white/10'
                        }`}
                      >
                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8">
                {!evaluation ? (
                  <button onClick={handleSubmit} disabled={!answer.trim() || submitting}
                    className="btn-primary w-full py-5 text-lg group">
                    {submitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Deep Analysis...</> : <><Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Submit to AI Assistant</>}
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-6 items-start">
                      <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-display shadow-2xl shrink-0
                        ${evaluation.score >= 7 ? 'bg-emerald-500 text-white' : evaluation.score >= 4 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
                        <span className="text-2xl font-black">{evaluation.score}</span>
                        <span className="text-[8px] font-black uppercase opacity-60">Score</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">AI Diagnostic</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{evaluation.feedback}</p>
                      </div>
                    </div>

                    {evaluation.improvedAnswer && (
                      <div className="glass-card bg-emerald-500/[0.03] border-emerald-500/20 p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">Refined Perspective</p>
                        <p className="text-text-secondary text-sm leading-relaxed italic">"{evaluation.improvedAnswer}"</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {currentQ < questions.length - 1 ? (
                        <button onClick={nextQuestion} className="btn-primary flex-1 py-5">
                          Continue to Next Stage <ChevronRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button onClick={handleComplete} className="btn-primary flex-1 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20">
                          <CheckCircle className="w-6 h-6" /> Finalize Evaluation
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
