import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Link } from 'react-router-dom';
import {
  FileText, Briefcase, MessageSquare, GraduationCap,
  TrendingUp, Users, Award, Clock, ArrowRight, Sparkles, Zap, Trophy
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Premium Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-card p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/5 to-transparent"
      >
        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Next-Gen Placement Suite
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
            {greeting}, <br className="sm:hidden" />
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-md">
            Your placement ecosystem is optimized and ready for today's challenges.
          </p>
        </div>
        
        <div className="shrink-0 w-full md:w-auto">
          <div className="glass-card p-8 border-primary/20 bg-primary/5 min-w-[300px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-20 h-20 rotate-12" />
            </div>
            
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em] mb-1">Career Level</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-black text-primary shadow-glow shadow-primary/20">
                    {user?.level || 1}
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    {user?.level >= 10 ? 'Elite Candidate' : user?.level >= 5 ? 'Job Ready' : 'Rising Talent'}
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                 <div className="flex items-center gap-2 mb-1">
                   <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                   <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">Streak</span>
                 </div>
                 <p className="text-xl font-black text-white">{user?.streak?.count || 0} Days</p>
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-primary">Next Level</span>
                <span className="text-text-muted">{(user?.xp || 0)} / {(user?.level || 1) * 500} XP</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((user?.xp || 0) / ((user?.level || 1) * 500)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-glow shadow-primary/30"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">Performance Metrics</h2>
          <div className="text-xs text-text-muted font-bold flex items-center gap-2">
            Updated just now <Clock className="w-3 h-3" />
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-3xl" />)}
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-stats">
            <DashboardView stats={stats} />
          </motion.div>
        )}
      </section>

      {/* Quick Actions & Journey */}
      {user?.role === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-2xl font-bold tracking-tight">Accelerate Your Journey</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { to: '/resume', label: 'Analyse Resume', desc: 'ATS scoring & gap analysis', icon: FileText, color: 'from-blue-500 to-indigo-600' },
                { to: '/interview', label: 'Practice Interview', desc: 'Mock technical & HR rounds', icon: MessageSquare, color: 'from-purple-500 to-pink-600' },
                { to: '/jobs', label: 'Find Jobs', desc: 'Curated roles for your profile', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
                { to: '/learning', label: 'Upskill Now', desc: 'AI learning paths', icon: GraduationCap, color: 'from-orange-500 to-rose-600' },
              ].map((a, i) => (
                <Link key={a.to} to={a.to}
                  className="glass-card p-6 flex items-start gap-4 group hover:border-primary/40 transition-all duration-500">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <a.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-display font-bold text-lg group-hover:text-primary transition-colors">{a.label}</p>
                      <ArrowRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Feed & Badges */}
          <div className="space-y-6">
            {user?.badges?.length > 0 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold tracking-tight">Achievements</h2>
                <div className="glass-card p-6 flex flex-wrap gap-4">
                  {user.badges.map((b, i) => (
                    <div key={i} className="group relative">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all cursor-help">
                        <Award className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-dark-900 border border-white/10 rounded-lg text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {b.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="font-display text-2xl font-bold tracking-tight">Live Updates</h2>
            <div className="glass-card p-8 divide-y divide-white/5 space-y-6">
              {[
                { title: 'Google SDE-1 Hiring', time: '2h ago', tag: 'Hot', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                { title: 'Interview with Amazon', time: 'Tomorrow', tag: 'Reminder', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { title: 'New Learning Roadmap', time: '1d ago', tag: 'AI', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              ].map((n, i) => (
                <div key={i} className="pt-6 first:pt-0 group cursor-pointer space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${n.color}`}>
                      {n.tag}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold">{n.time}</span>
                  </div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
