import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import {
  Briefcase, MapPin, Clock, DollarSign, Search,
  Filter, Bookmark, BookmarkCheck, Loader2, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
// JobBoard.jsx — top of file
import { ExternalLink } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function JobBoard() {
  const { user } = useAuth();
  const socket = useSocket();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [savedJobs, setSavedJobs] = useState(user?.savedJobs || []);
  const [source, setSource] = useState('internal'); // 'internal' or 'adzuna'

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (source === 'adzuna') {
        const { data } = await api.get(`/jobs/adzuna?what=${search || 'software'}&page=${page}`);
        setJobs(data.jobs);
        setPagination({ totalPages: 5, currentPage: page }); // Adzuna paging simplified
      } else {
        const params = new URLSearchParams({ page, limit: 12 });
        if (search) params.append('search', search);
        if (typeFilter) params.append('type', typeFilter);
        const { data } = await api.get(`/jobs?${params}`);
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [page, typeFilter, source]);

  useEffect(() => {
    if (!socket) return;
    const handleNewJob = (job) => {
      setJobs(prev => [{ ...job, isNew: true }, ...prev]);
    };
    socket.on('job-posted', handleNewJob);
    return () => socket.off('job-posted', handleNewJob);
  }, [socket]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const toggleSave = async (jobId) => {
    try {
      const { data } = await api.post(`/jobs/${jobId}/save`);
      setSavedJobs(data.savedJobs);
    } catch { /* ignore */ }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, applied: true } : j));
    } catch { /* ignore */ }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold"><span className="gradient-text">Job Board</span></h1>
            <p className="text-text-secondary mt-1">Discover opportunities matching your profile</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
            <button 
              onClick={() => { setSource('internal'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${source === 'internal' ? 'bg-primary text-white shadow-glow shadow-primary/20' : 'text-text-muted hover:text-white'}`}
            >
              Portal Jobs
            </button>
            <button 
              onClick={() => { setSource('adzuna'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${source === 'adzuna' ? 'bg-primary text-white shadow-glow shadow-primary/20' : 'text-text-muted hover:text-white'}`}
            >
              Live Jobs (Adzuna)
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, companies..." className="input-field pl-10" />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar-hide">
          {['', 'Full-time', 'Internship', 'Part-time', 'Contract'].map(t => (
            <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                ${typeFilter === t ? 'bg-primary text-white shadow-glow shadow-primary/20' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
              {t || 'All'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Briefcase className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="font-display text-xl font-semibold">No jobs found</p>
          <p className="text-text-secondary mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div key={job._id} custom={i} variants={fadeUp}
              className={`glass-card glass-card-hover p-6 flex flex-col ${job.isNew ? 'ring-1 ring-emerald-500/50' : ''}`}>
              {job.isNew && <span className="badge badge-green text-[10px] mb-3 self-start">New</span>}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-semibold">{job.title}</h3>
                    {['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato'].includes(job.company) && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-md border border-primary/20">
                        <Sparkles className="w-2 h-2" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm">{job.company}</p>
                </div>
                <button onClick={() => toggleSave(job._id)} className="p-1.5 rounded-lg hover:bg-white/5">
                  {savedJobs.includes(job._id)
                    ? <BookmarkCheck className="w-5 h-5 text-primary" />
                    : <Bookmark className="w-5 h-5 text-text-muted" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-xs text-text-muted">
                {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                {job.salary?.min && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary.min}-{job.salary.max} {job.salary.currency}</span>}
              </div>

              {job.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {job.requiredSkills.slice(0, 4).map(s => (
                    <span key={s} className="badge badge-blue text-[10px]">{s}</span>
                  ))}
                  {job.requiredSkills.length > 4 && <span className="badge badge-blue text-[10px]">+{job.requiredSkills.length - 4}</span>}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                {job.deadline && <span className="text-text-muted text-xs">Due {formatDate(job.deadline)}</span>}
                <div className="flex gap-2 ml-auto">
                  {source === 'adzuna' ? (
                    <a href={job.url} target="_blank" rel="noopener noreferrer" 
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-2">
                      Apply Externally <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <>
                      <Link to={`/jobs/${job._id}`} className="btn-secondary text-xs py-1.5 px-3">Details</Link>
                      {user?.role === 'student' && (
                        <button onClick={() => handleApply(job._id)} disabled={job.applied}
                          className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50">
                          {job.applied ? 'Applied' : 'Apply'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-secondary p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-text-secondary text-sm">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
            className="btn-secondary p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
