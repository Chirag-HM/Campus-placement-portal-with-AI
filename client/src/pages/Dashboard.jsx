import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Link } from 'react-router-dom';
import {
  FileText, Briefcase, MessageSquare, GraduationCap,
  TrendingUp, Users, Award, Clock, ArrowRight
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

function StatCard({ icon: Icon, label, value, color, link, index }) {
  return (
    <motion.div custom={index} initial="hidden" animate="visible" variants={fadeUp}>
      <Link to={link} className="glass-card glass-card-hover p-6 flex items-start gap-4 block">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold">{value ?? '—'}</p>
          <p className="text-text-secondary text-sm">{label}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function StudentDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={FileText} label="Resume Score" value={stats?.latestResumeScore ? `${stats.latestResumeScore}%` : 'Upload'} color="from-blue-500 to-cyan-500" link="/resume" index={0} />
      <StatCard icon={Briefcase} label="Jobs Applied" value={stats?.appliedCount || 0} color="from-purple-500 to-pink-500" link="/jobs" index={1} />
      <StatCard icon={MessageSquare} label="Avg Interview Score" value={stats?.avgInterviewScore ? `${stats.avgInterviewScore}%` : '—'} color="from-orange-500 to-red-500" link="/interview" index={2} />
      <StatCard icon={GraduationCap} label="Learning Path" value={stats?.hasLearningPath ? 'Active' : 'Start'} color="from-emerald-500 to-teal-500" link="/learning" index={3} />
    </div>
  );
}

function RecruiterDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Briefcase} label="Posted Jobs" value={stats?.postedJobs || 0} color="from-blue-500 to-cyan-500" link="/recruiter" index={0} />
      <StatCard icon={Users} label="Total Applicants" value={stats?.totalApplicants || 0} color="from-purple-500 to-pink-500" link="/recruiter" index={1} />
      <StatCard icon={Award} label="Shortlisted" value={stats?.shortlisted || 0} color="from-emerald-500 to-teal-500" link="/recruiter" index={2} />
      <StatCard icon={Clock} label="Pending Review" value={stats?.pendingReview || 0} color="from-orange-500 to-red-500" link="/recruiter" index={3} />
    </div>
  );
}

function AdminDashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard icon={Users} label="Students" value={stats?.totalStudents || 0} color="from-blue-500 to-cyan-500" link="/admin" index={0} />
      <StatCard icon={Users} label="Recruiters" value={stats?.totalRecruiters || 0} color="from-purple-500 to-pink-500" link="/admin" index={1} />
      <StatCard icon={Briefcase} label="Total Jobs" value={stats?.totalJobs || 0} color="from-orange-500 to-red-500" link="/admin" index={2} />
      <StatCard icon={MessageSquare} label="Interviews" value={stats?.totalInterviews || 0} color="from-emerald-500 to-teal-500" link="/admin" index={3} />
      <StatCard icon={Award} label="Hired" value={stats?.totalHired || 0} color="from-yellow-500 to-orange-500" link="/admin" index={4} />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const DashboardView = user?.role === 'admin' ? AdminDashboard
    : user?.role === 'recruiter' ? RecruiterDashboard : StudentDashboard;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-text-secondary mt-1">Here's your placement journey overview</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : (
        <DashboardView stats={stats} />
      )}

      {/* Quick Actions */}
      {user?.role === 'student' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: '/resume', label: 'Analyse Resume', desc: 'Upload & get AI feedback', icon: FileText, color: 'from-blue-500 to-cyan-500' },
              { to: '/interview', label: 'Practice Interview', desc: 'AI mock interviews', icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
              { to: '/jobs', label: 'Browse Jobs', desc: 'Find opportunities', icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
            ].map((a) => (
              <Link key={a.to} to={a.to}
                className="glass-card glass-card-hover p-5 flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center`}>
                  <a.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-sm">{a.label}</p>
                  <p className="text-text-muted text-xs">{a.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
