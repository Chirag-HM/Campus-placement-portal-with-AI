import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Link } from 'react-router-dom';
import {
  FileText, Briefcase, MessageSquare, GraduationCap,
  TrendingUp, Users, Award, Clock, ArrowRight, Sparkles, Zap
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function StatCard({ icon: Icon, label, value, color, link, index }) {
  return (
    <motion.div variants={itemVariants}>
      <Link to={link} className="glass-card p-6 flex flex-col gap-4 group">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3" />
            +12%
          </div>
        </div>
        <div>
          <p className="text-3xl font-display font-bold tracking-tight mb-1">{value ?? '—'}</p>
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{label}</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Zap className="w-4 h-4 text-white/10" />
        </div>
      </Link>
    </motion.div>
  );
}

function StudentDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={FileText} label="Resume Score" value={stats?.latestResumeScore ? `${stats.latestResumeScore}%` : 'Upload'} color="from-blue-500 to-indigo-600" link="/resume" index={0} />
      <StatCard icon={Briefcase} label="Jobs Applied" value={stats?.appliedCount || 0} color="from-purple-500 to-pink-600" link="/jobs" index={1} />
      <StatCard icon={MessageSquare} label="Interview Avg" value={stats?.avgInterviewScore ? `${stats.avgInterviewScore}%` : '—'} color="from-orange-500 to-rose-600" link="/interview" index={2} />
      <StatCard icon={GraduationCap} label="Learning Path" value={stats?.hasLearningPath ? 'Active' : 'Start'} color="from-emerald-500 to-teal-600" link="/learning" index={3} />
    </div>
  );
}

function RecruiterDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Briefcase} label="Posted Jobs" value={stats?.postedJobs || 0} color="from-blue-500 to-indigo-600" link="/recruiter" index={0} />
      <StatCard icon={Users} label="Applicants" value={stats?.totalApplicants || 0} color="from-purple-500 to-pink-600" link="/recruiter" index={1} />
      <StatCard icon={Award} label="Shortlisted" value={stats?.shortlisted || 0} color="from-emerald-500 to-teal-600" link="/recruiter" index={2} />
      <StatCard icon={Clock} label="Pending Review" value={stats?.pendingReview || 0} color="from-orange-500 to-rose-600" link="/recruiter" index={3} />
    </div>
  );
}

function AdminDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard icon={Users} label="Students" value={stats?.totalStudents || 0} color="from-blue-500 to-indigo-600" link="/admin" index={0} />
      <StatCard icon={Users} label="Recruiters" value={stats?.totalRecruiters || 0} color="from-purple-500 to-pink-600" link="/admin" index={1} />
      <StatCard icon={Briefcase} label="Total Jobs" value={stats?.totalJobs || 0} color="from-orange-500 to-rose-600" link="/admin" index={2} />
      <StatCard icon={MessageSquare} label="Interviews" value={stats?.totalInterviews || 0} color="from-emerald-500 to-teal-600" link="/admin" index={3} />
      <StatCard icon={Award} label="Hired" value={stats?.totalHired || 0} color="from-yellow-500 to-orange-600" link="/admin" index={4} />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    api.get('/user/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const DashboardView = user?.role === 'admin' ? AdminDashboard
    : user?.role === 'recruiter' ? RecruiterDashboard : StudentDashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">AI Powered Portal</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-text-secondary mt-2 text-lg">Your placement analytics are looking great today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest leading-none mb-1">Current Status</p>
              <p className="text-sm font-bold text-white">Actively Seeking</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50" />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <DashboardView stats={stats} />
        </motion.div>
      )}

      {/* Quick Actions & Journey */}
      {user?.role === 'student' && (
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              Next Steps <ArrowRight className="w-5 h-5 text-text-muted" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { to: '/resume', label: 'Analyse Resume', desc: 'Instant ATS scoring & gap analysis', icon: FileText, color: 'from-blue-500 to-indigo-600' },
                { to: '/interview', label: 'Practice Interview', desc: 'Mock technical & HR rounds', icon: MessageSquare, color: 'from-purple-500 to-pink-600' },
                { to: '/jobs', label: 'Find Jobs', desc: 'Curated roles for your skill profile', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
                { to: '/learning', label: 'Upskill Now', desc: 'Personalized AI learning paths', icon: GraduationCap, color: 'from-orange-500 to-rose-600' },
              ].map((a, i) => (
                <Link key={a.to} to={a.to}
                  className="glass-card p-6 flex items-start gap-4 group hover:border-primary/40 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shrink-0 shadow-lg`}>
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-display font-bold text-base group-hover:text-primary transition-colors">{a.label}</p>
                      <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Activity/News Feed */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-6">
            <h2 className="font-display text-2xl font-bold mb-6">Placement News</h2>
            <div className="glass-card p-6 divide-y divide-white/5 space-y-4">
              {[
                { title: 'Google SDE-1 Hiring', time: '2h ago', tag: 'Hot' },
                { title: 'Interview with Amazon', time: 'Tomorrow', tag: 'Reminder' },
                { title: 'New Learning Roadmap', time: '1d ago', tag: 'AI' },
              ].map((n, i) => (
                <div key={i} className={`pt-4 first:pt-0 group cursor-pointer`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">{n.tag}</span>
                    <span className="text-[10px] text-text-muted">{n.time}</span>
                  </div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{n.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
