import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { Briefcase, Users, Loader2, Plus, X, Sparkles, ChevronDown } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [shortlisting, setShortlisting] = useState(null);
  const [shortlistResults, setShortlistResults] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [form, setForm] = useState({
    title: '', company: '', description: '', location: '', type: 'Full-time',
    requiredSkills: '', salary: { min: '', max: '', currency: 'INR' },
    deadline: '', rounds: '',
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.get('/jobs/my-jobs').then(r => setJobs(r.data.jobs)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const payload = {
        ...form,
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        rounds: form.rounds.split(',').map(s => s.trim()).filter(Boolean),
        salary: { min: Number(form.salary.min), max: Number(form.salary.max), currency: form.salary.currency },
      };
      const { data } = await api.post('/jobs', payload);
      setJobs(prev => [data.job, ...prev]);
      setShowForm(false);
      setForm({ title: '', company: '', description: '', location: '', type: 'Full-time', requiredSkills: '', salary: { min: '', max: '', currency: 'INR' }, deadline: '', rounds: '' });
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  const handleShortlist = async (jobId) => {
    setShortlisting(jobId);
    try {
      const { data } = await api.post('/resume/ai-shortlist', { jobId });
      setShortlistResults({ jobId, results: data.results });
    } catch { /* ignore */ }
    finally { setShortlisting(null); }
  };

  const updateStatus = async (jobId, studentId, status) => {
    try {
      await api.patch('/jobs/application-status', { jobId, studentId, status });
      setJobs(prev => prev.map(j => {
        if (j._id !== jobId) return j;
        return { ...j, applications: j.applications.map(a => a.student?._id === studentId ? { ...a, status } : a) };
      }));
    } catch { /* ignore */ }
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold"><span className="gradient-text">Recruiter Dashboard</span></h1>
          <p className="text-text-secondary mt-1">Manage your job postings and applicants</p>
        </motion.div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Post Job</>}
        </button>
      </div>

      {/* Post Job Form */}
      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handlePost} className="glass-card p-6 mb-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Job Title *" required />
            <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="input-field" placeholder="Company *" required />
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="input-field" placeholder="Location" />
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
              {['Full-time', 'Internship', 'Part-time', 'Contract'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input value={form.salary.min} onChange={e => setForm(p => ({ ...p, salary: { ...p.salary, min: e.target.value } }))} className="input-field" placeholder="Min Salary" type="number" />
            <input value={form.salary.max} onChange={e => setForm(p => ({ ...p, salary: { ...p.salary, max: e.target.value } }))} className="input-field" placeholder="Max Salary" type="number" />
            <input value={form.requiredSkills} onChange={e => setForm(p => ({ ...p, requiredSkills: e.target.value }))} className="input-field" placeholder="Skills (comma-separated)" />
            <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="input-field" />
          </div>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field h-24 resize-none" placeholder="Job Description *" required />
          <button type="submit" disabled={posting} className="btn-primary px-8">
            {posting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : 'Post Job'}
          </button>
        </motion.form>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map(job => (
          <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6">
            <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}>
              <div>
                <h3 className="font-display font-semibold text-lg">{job.title}</h3>
                <p className="text-text-secondary text-sm">{job.company} • {job.location || 'Remote'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge badge-blue"><Users className="w-3 h-3 mr-1" />{job.applications?.length || 0}</span>
                <ChevronDown className={`w-5 h-5 text-text-muted transition-transform ${expandedJob === job._id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {expandedJob === job._id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-semibold text-sm">Applicants</h4>
                  <button onClick={() => handleShortlist(job._id)} disabled={shortlisting === job._id}
                    className="btn-secondary text-xs py-1.5">
                    {shortlisting === job._id ? <><Loader2 className="w-3 h-3 animate-spin" /> Shortlisting...</>
                      : <><Sparkles className="w-3 h-3" /> AI Shortlist</>}
                  </button>
                </div>

                {shortlistResults?.jobId === job._id && (
                  <div className="mb-4 glass-card bg-white/[0.03] p-4 space-y-2">
                    <h5 className="text-xs font-semibold text-emerald">AI Rankings</h5>
                    {shortlistResults.results.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{r.name}</span>
                        <span className="badge badge-green">{r.matchScore}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {job.applications?.length === 0 ? (
                  <p className="text-text-muted text-sm">No applicants yet</p>
                ) : (
                  <div className="space-y-2">
                    {job.applications.map(app => (
                      <div key={app.student?._id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                        <div className="flex items-center gap-3">
                          <img src={app.student?.avatar || `https://ui-avatars.com/api/?name=${app.student?.name}&size=32&background=3B82F6&color=fff`}
                            alt="" className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-sm font-medium">{app.student?.name}</p>
                            <p className="text-text-muted text-xs">{app.student?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {app.matchScore > 0 && <span className="badge badge-blue text-[10px]">{app.matchScore}%</span>}
                          <select value={app.status} onChange={(e) => updateStatus(job._id, app.student?._id, e.target.value)}
                            className="input-field py-1 px-2 text-xs w-auto">
                            {['applied', 'shortlisted', 'rejected', 'hired'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
