import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { Users, Briefcase, Award, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/dashboard-stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      const { data } = await api.get(`/user/all?${params}`);
      setUsers(data.users);
      setUserPagination(data.pagination);
    } catch { /* ignore */ }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch('/user/role', { userId, role });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
    } catch { /* ignore */ }
  };

  const chartData = stats ? [
    { name: 'Students', value: stats.totalStudents },
    { name: 'Recruiters', value: stats.totalRecruiters },
    { name: 'Jobs', value: stats.totalJobs },
    { name: 'Interviews', value: stats.totalInterviews },
    { name: 'Hired', value: stats.totalHired },
  ] : [];

  const pieData = stats ? [
    { name: 'Students', value: stats.totalStudents || 1 },
    { name: 'Recruiters', value: stats.totalRecruiters || 1 },
  ] : [];

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold"><span className="gradient-text">Admin Dashboard</span></h1>
        <p className="text-text-secondary mt-1">Platform overview and user management</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Users, label: 'Students', value: stats?.totalStudents, color: 'from-blue-500 to-cyan-500' },
          { icon: Users, label: 'Recruiters', value: stats?.totalRecruiters, color: 'from-purple-500 to-pink-500' },
          { icon: Briefcase, label: 'Jobs', value: stats?.totalJobs, color: 'from-orange-500 to-red-500' },
          { icon: MessageSquare, label: 'Interviews', value: stats?.totalInterviews, color: 'from-emerald-500 to-teal-500' },
          { icon: Award, label: 'Hired', value: stats?.totalHired, color: 'from-yellow-500 to-orange-500' },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}
            className="glass-card p-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-display text-2xl font-bold">{s.value || 0}</p>
            <p className="text-text-muted text-xs">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">Platform Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-text-secondary">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* User Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-lg mb-4">User Management</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchUsers()}
              className="input-field pl-10" placeholder="Search users..." />
          </div>
          <div className="flex gap-2">
            {['', 'student', 'recruiter', 'admin'].map(r => (
              <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all
                  ${roleFilter === r ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                {r || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-text-muted text-xs text-left">
              <th className="py-3 px-2">User</th><th className="py-3 px-2">Email</th><th className="py-3 px-2">Role</th><th className="py-3 px-2">Joined</th><th className="py-3 px-2">Actions</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&size=32&background=3B82F6&color=fff`}
                        alt="" className="w-7 h-7 rounded-full" />
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-text-secondary">{u.email}</td>
                  <td className="py-3 px-2"><span className={`badge badge-${u.role === 'admin' ? 'purple' : u.role === 'recruiter' ? 'blue' : 'green'} text-[10px] capitalize`}>{u.role}</span></td>
                  <td className="py-3 px-2 text-text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} className="input-field py-1 px-2 text-xs w-auto">
                      {['student', 'recruiter', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {userPagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary p-2 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-text-secondary text-sm">Page {page} of {userPagination.pages}</span>
            <button onClick={() => setPage(p => Math.min(userPagination.pages, p + 1))} disabled={page === userPagination.pages} className="btn-secondary p-2 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
