import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Clock, DollarSign, Building, Calendar, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data.job)).catch(() => navigate('/jobs')).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`);
      setJob(prev => ({ ...prev, applied: true }));
    } catch { /* ignore */ }
    finally { setApplying(false); }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}</div>;
  if (!job) return null;

  const hasApplied = job.applications?.some(a => a.student?._id === user?._id || a.student === user?._id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">{job.title}</h1>
            <p className="text-text-secondary flex items-center gap-2"><Building className="w-4 h-4" /> {job.company}</p>
          </div>
          <span className={`badge ${job.isActive ? 'badge-green' : 'badge-red'}`}>{job.isActive ? 'Active' : 'Closed'}</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-text-secondary">
          {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
          {job.salary?.min && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary.min}-{job.salary.max} {job.salary.currency}</span>}
          {job.deadline && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Deadline: {formatDate(job.deadline)}</span>}
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.applications?.length || 0} applicants</span>
        </div>

        <div className="border-t border-white/10 pt-6 mb-6">
          <h2 className="font-display font-semibold mb-3">Description</h2>
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {job.requiredSkills?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display font-semibold text-sm mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">{job.requiredSkills.map(s => <span key={s} className="badge badge-blue">{s}</span>)}</div>
          </div>
        )}

        {job.eligibility && (
          <div className="glass-card bg-white/[0.03] p-4 mb-6">
            <h3 className="font-display font-semibold text-sm mb-2">Eligibility</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-text-secondary">
              {job.eligibility.branches?.length > 0 && <div><p className="text-text-muted text-xs">Branches</p>{job.eligibility.branches.join(', ')}</div>}
              {job.eligibility.minCGPA && <div><p className="text-text-muted text-xs">Min CGPA</p>{job.eligibility.minCGPA}</div>}
              {job.eligibility.graduationYear && <div><p className="text-text-muted text-xs">Graduation</p>{job.eligibility.graduationYear}</div>}
            </div>
          </div>
        )}

        {user?.role === 'student' && (
          <button onClick={handleApply} disabled={hasApplied || applying}
            className="btn-primary w-full justify-center py-3 disabled:opacity-50">
            {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : hasApplied ? 'Already Applied' : 'Apply Now'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
