import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { Upload, FileText, Loader2, CheckCircle, XCircle, AlertTriangle, Sparkles, History, ChevronDown, Target, Brain, Info } from 'lucide-react';

function ScoreRing({ score, label, color = '#3B82F6', icon: Icon }) {
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-white/5 blur-xl group-hover:bg-primary/5 transition-colors" />
        <svg width={size} height={size} className="-rotate-90 relative z-10">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth} fill="none" />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} stroke={color}
            strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeDasharray={circumference} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center relative z-10">
          <span className="font-display text-3xl font-bold tracking-tight">{score}%</span>
          {Icon && <Icon className="w-4 h-4 text-text-muted mt-1" />}
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</p>
    </div>
  );
}

export default function ResumeAnalyser() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (e) {
      const msg = e.response?.data?.message || 'Upload failed';
      setError(msg);
      throw new Error(msg);
    } finally { setUploading(false); }
  };

  const handleAnalyse = async () => {
    if (!jobDesc.trim()) { setError('Please enter a job description'); return; }
    setAnalysing(true); setError(''); setAnalysis(null);
    try {
      if (file) await handleUpload();
      const { data } = await api.post('/resume/analyse', { jobDescription: jobDesc });
      setAnalysis(data.analysis);
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || e.message || 'Analysis failed';
      setError(msg);
    } finally { setAnalysing(false); }
  };

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/resume/history');
      setHistory(data.history || []);
      setShowHistory(!showHistory);
    } catch { /* ignore */ }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') setFile(droppedFile);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">AI Diagnostic Tool</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          <span className="gradient-text">Resume Engine</span>
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
          Our advanced AI analyzes your resume against industry-standard ATS algorithms to ensure you land the interview.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Input Data
            </h2>
            
            <div className="space-y-6">
              {/* Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 overflow-hidden group ${
                  file ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-primary/30 hover:bg-white/[0.02]'
                }`}>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                <div className="relative z-10">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-sm text-white mb-1">{file.name}</p>
                      <p className="text-text-muted text-[10px] uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF READY</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-text-muted mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="text-text-secondary font-bold text-sm mb-1">Upload Resume</p>
                      <p className="text-text-muted text-xs">Drag & drop or click to browse</p>
                    </>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Target Job Description</label>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1 cursor-help"><Info className="w-3 h-3" /> Requirements</span>
                </div>
                <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="input-field h-48 resize-none text-xs leading-relaxed" />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </motion.div>
              )}

              <div className="flex flex-col gap-3">
                <button onClick={handleAnalyse} disabled={analysing || (!file && !jobDesc)}
                  className="btn-primary py-4 text-sm group">
                  {analysing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  {analysing ? 'Generating Diagnosis...' : 'Run AI Diagnosis'}
                </button>

                <button onClick={loadHistory} className="btn-secondary py-3 text-xs">
                  <History className="w-4 h-4" /> {showHistory ? 'Hide Analysis History' : 'View Past Reports'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* History Accordion */}
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden">
                {history.length > 0 ? history.map((h, i) => (
                  <div key={i} className="glass-card p-4 cursor-pointer hover:border-primary/30 transition-all flex items-center justify-between"
                    onClick={() => setAnalysis(h)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Target className="w-5 h-5 text-text-muted" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{h.jobTitle || 'General Analysis'}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{new Date(h.analysedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="badge badge-purple">{h.matchScore}%</span>
                  </div>
                )) : <div className="text-center p-8 text-text-muted text-xs italic">No past reports found.</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {analysing ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-10 h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 mb-8 relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
                  <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Analyzing Candidate Fit</h3>
                <p className="text-text-secondary text-sm max-w-sm text-center">Comparing keywords, syntax, and skill clusters against the target role requirements...</p>
              </motion.div>
            ) : analysis ? (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card p-8">
                  <div className="flex flex-wrap justify-center gap-12 mb-10">
                    <ScoreRing score={analysis.matchScore} label="Job Match" icon={Target} color="#3B82F6" />
                    <ScoreRing score={analysis.atsScore} label="ATS Score" icon={FileText} color="#10B981" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Strengths & Gaps */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Top Strengths
                        </h3>
                        <div className="space-y-2">
                          {analysis.strengths?.map((s, i) => (
                            <div key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/5">
                              <span className="text-emerald-500 font-bold">✓</span> {s}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-400 flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Priority Gaps
                        </h3>
                        <div className="space-y-2">
                          {analysis.gaps?.map((g, i) => (
                            <div key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed p-2 rounded-lg bg-red-500/5 border border-red-500/5">
                              <span className="text-red-500 font-bold">!</span> {g}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Keywords & Suggestions */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Keywords Snapshot</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-emerald-500 mb-2">FOUND IN RESUME</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.keywordsFound?.map((k, i) => (
                                <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-medium border border-white/5">{k}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-red-400 mb-2">MISSING REQUIREMENTS</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.keywordsMissing?.map((k, i) => (
                                <span key={i} className="px-2 py-1 bg-red-500/10 rounded-md text-[10px] font-medium border border-red-500/10 text-red-400">{k}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> AI Suggestions
                        </h3>
                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                          <ul className="space-y-3">
                            {analysis.suggestions?.map((s, i) => (
                              <li key={i} className="text-xs text-text-secondary flex gap-2">
                                <span className="text-yellow-500">•</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-4">Executive Summary</h3>
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm text-text-secondary leading-relaxed">
                      "{analysis.overallFeedback}"
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-text-muted">
                  <FileText className="w-10 h-10" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Awaiting Diagnosis</h3>
                <p className="text-text-secondary text-sm max-w-sm">Provide your resume and job details to unlock deep AI insights and competitive scores.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
