import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { Upload, FileText, Loader2, CheckCircle, XCircle, AlertTriangle, Sparkles, History, ChevronDown } from 'lucide-react';

function ScoreRing({ score, size = 120, strokeWidth = 8, color = '#3B82F6' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={radius} stroke={color}
          strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeDasharray={circumference} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl font-bold">{score}%</span>
      </div>
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
      throw new Error(msg); // propagate so analyse stops
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-2">
          <span className="gradient-text">AI Resume Analyser</span>
        </h1>
        <p className="text-text-secondary mb-8">Upload your resume and get AI-powered feedback against any job description</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-6 space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-white/[0.02] transition-all">
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-text-muted text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">Drag & drop your PDF resume here</p>
                  <p className="text-text-muted text-xs mt-1">or click to browse (max 10MB)</p>
                </>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here to compare against your resume..."
                className="input-field h-40 resize-none" />
            </div>

            {error && <p className="text-red-400 text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{error}</p>}

            <button onClick={handleAnalyse} disabled={analysing || (!file && !jobDesc)}
              className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {analysing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analysing...</> : <><Sparkles className="w-5 h-5" /> Analyse Resume</>}
            </button>

            <button onClick={loadHistory} className="btn-secondary w-full justify-center">
              <History className="w-4 h-4" /> {showHistory ? 'Hide' : 'View'} History
              <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* History */}
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3 overflow-hidden">
                {history.map((h, i) => (
                  <div key={i} className="glass-card p-4 cursor-pointer hover:bg-white/[0.08] transition-colors"
                    onClick={() => setAnalysis(h)}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{h.jobTitle || 'Analysis'}</p>
                      <span className="badge badge-blue">{h.matchScore}%</span>
                    </div>
                    <p className="text-text-muted text-xs mt-1">{new Date(h.analysedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          {analysing ? (
            <div className="glass-card p-6 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-6 rounded" style={{ width: `${80 - i * 10}%` }} />)}
              <div className="skeleton h-24 rounded-xl mt-4" />
            </div>
          ) : analysis ? (
            <div className="glass-card p-6 space-y-6">
              {/* Scores */}
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <ScoreRing score={analysis.matchScore} color="#3B82F6" />
                  <p className="text-text-secondary text-sm mt-2">Match Score</p>
                </div>
                <div className="text-center">
                  <ScoreRing score={analysis.atsScore} color="#10B981" />
                  <p className="text-text-secondary text-sm mt-2">ATS Score</p>
                </div>
              </div>

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Strengths
                  </h3>
                  <div className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <p key={i} className="text-text-secondary text-sm pl-6">• {s}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps */}
              {analysis.gaps?.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" /> Gaps
                  </h3>
                  <div className="space-y-2">
                    {analysis.gaps.map((g, i) => (
                      <p key={i} className="text-text-secondary text-sm pl-6">• {g}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-muted mb-2">Keywords Found</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysis.keywordsFound || []).map((k, i) => (
                      <span key={i} className="badge badge-green text-[10px]">{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-muted mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysis.keywordsMissing || []).map((k, i) => (
                      <span key={i} className="badge badge-red text-[10px]">{k}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {analysis.suggestions?.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" /> Suggestions
                  </h3>
                  <div className="space-y-2">
                    {analysis.suggestions.map((s, i) => (
                      <p key={i} className="text-text-secondary text-sm pl-6">• {s}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {analysis.overallFeedback && (
                <div className="glass-card p-4 bg-white/[0.03]">
                  <h3 className="font-display font-semibold text-sm mb-2">Overall Feedback</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{analysis.overallFeedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <FileText className="w-16 h-16 text-text-muted mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">No Analysis Yet</h3>
              <p className="text-text-secondary text-sm">Upload your resume and enter a job description to get AI-powered insights</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
