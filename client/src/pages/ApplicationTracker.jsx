import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { 
  Briefcase, Plus, Search, Filter, MoreVertical, 
  MapPin, Clock, ExternalLink, Trash2, Edit2, 
  CheckCircle, XCircle, Clock4, Send, Star
} from 'lucide-react';

const COLUMNS = [
  { id: 'applied', title: 'Applied', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'shortlisted', title: 'Shortlisted', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'interviewing', title: 'Interviewing', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'offered', title: 'Offered', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'rejected', title: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10' }
];

export default function ApplicationTracker() {
  const { user, refreshUser } = useAuth();
  const [internalApps, setInternalApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({ title: '', company: '', status: 'applied', notes: '' });

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/jobs/applied');
        setInternalApps(data.jobs);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const allApps = useMemo(() => {
    const internal = internalApps.map(app => ({
      id: app._id,
      title: app.title,
      company: app.company,
      status: app.applicationStatus,
      isInternal: true,
      appliedAt: app.appliedAt,
      matchScore: app.matchScore
    }));

    const external = (user?.externalApplications || []).map(app => ({
      id: app._id,
      title: app.title,
      company: app.company,
      status: app.status,
      isInternal: false,
      appliedAt: app.appliedAt,
      notes: app.notes
    }));

    return [...internal, ...external];
  }, [internalApps, user?.externalApplications]);

  const handleAddExternal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/external-apps', newApp);
      await refreshUser();
      setShowAddModal(false);
      setNewApp({ title: '', company: '', status: 'applied', notes: '' });
    } catch (error) {
      console.error('Failed to add application:', error);
    }
  };

  const handleUpdateStatus = async (id, isInternal, newStatus) => {
    try {
      if (isInternal) {
        // Internal status is usually managed by recruiter, 
        // but we can allow student to move it for their own view or if permitted
        // For now, let's say only external apps are draggable/movable by student
        return; 
      }
      await api.patch(`/user/external-apps/${id}`, { status: newStatus });
      await refreshUser();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id, isInternal) => {
    if (isInternal) return;
    try {
      await api.delete(`/user/external-apps/${id}`);
      await refreshUser();
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="skeleton h-20 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-[600px] rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight mb-2">
            Application <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-text-secondary">Manage your placement journey across all platforms.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-4 px-8 shadow-2xl shadow-primary/20 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add External Job
        </button>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
        {COLUMNS.map(column => (
          <div key={column.id} className="flex flex-col gap-6">
            <div className={`flex items-center justify-between p-4 rounded-2xl ${column.bg} border border-white/5`}>
              <h3 className={`font-display font-bold uppercase tracking-widest text-[10px] ${column.color}`}>
                {column.title}
              </h3>
              <span className="text-xs font-black text-text-muted">
                {allApps.filter(a => a.status === column.id).length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[500px]">
              <AnimatePresence mode="popLayout">
                {allApps
                  .filter(app => app.status === column.id)
                  .map(app => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-5 group cursor-grab active:cursor-grabbing border-white/5 hover:border-primary/30"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${app.isInternal ? 'bg-primary animate-pulse' : 'bg-text-muted'}`} />
                          <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                            {app.isInternal ? 'PlaceAI Job' : 'External'}
                          </p>
                        </div>
                        {!app.isInternal && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleDelete(app.id, false)}
                              className="p-1.5 hover:bg-red-500/10 text-text-muted hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-base mb-1 group-hover:text-primary transition-colors leading-tight">
                        {app.title}
                      </h4>
                      <p className="text-sm text-text-secondary mb-4">{app.company}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold">
                          <Clock4 className="w-3 h-3" />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                        
                        {app.isInternal ? (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-lg">
                            <Star className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black text-primary">{app.matchScore}%</span>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            {COLUMNS.map(col => col.id !== app.status && (
                              <button
                                key={col.id}
                                onClick={() => handleUpdateStatus(app.id, false, col.id)}
                                className={`w-2 h-2 rounded-full border border-white/10 hover:scale-150 transition-all ${col.bg}`}
                                title={`Move to ${col.title}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              
              {allApps.filter(a => a.status === column.id).length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-text-muted text-[10px] font-black uppercase tracking-widest">
                  Empty Stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-10 max-w-lg w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-2xl font-bold">Track External Application</h2>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-white">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddExternal} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Job Title</label>
                  <input 
                    required
                    value={newApp.title} 
                    onChange={e => setNewApp({...newApp, title: e.target.value})}
                    placeholder="e.g. Software Engineer" 
                    className="input-field" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Company</label>
                  <input 
                    required
                    value={newApp.company} 
                    onChange={e => setNewApp({...newApp, company: e.target.value})}
                    placeholder="e.g. Google" 
                    className="input-field" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Current Stage</label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLUMNS.map(col => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setNewApp({...newApp, status: col.id})}
                        className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          newApp.status === col.id ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                        }`}
                      >
                        {col.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full py-4 text-lg">
                    Save Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
