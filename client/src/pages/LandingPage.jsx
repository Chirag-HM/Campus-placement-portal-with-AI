import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Target, ArrowRight, Brain, Briefcase, GraduationCap, Star, ChevronRight } from 'lucide-react';
import NeuralBackground from '@/components/NeuralBackground';

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative isolate min-h-screen">
      <NeuralBackground />
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] -z-10 opacity-30 blur-[120px] pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary rounded-full" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 sm:pt-48 sm:pb-40">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center relative z-10"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 shadow-2xl">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Empowering 100k+ Careers
          </motion.div>
          
          <motion.h1 variants={item} className="text-6xl sm:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
            Elevate Your <br />
            <span className="gradient-text">Placement Game</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            The all-in-one AI platform to automate your job search, refine your interview skills, and land offers from top-tier tech giants.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/login" className="btn-primary py-5 px-10 text-lg shadow-2xl shadow-primary/30 group">
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-10 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-lg flex items-center gap-2">
              Explore Tech Stack
              <ChevronRight className="w-4 h-4 opacity-50" />
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={item} className="mt-20 flex flex-col items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Trusted by students from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map(brand => (
                <span key={brand} className="text-2xl font-display font-black tracking-tighter text-white">{brand}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Stats Grid */}
        <div className="relative mt-40">
          <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-[4rem]" />
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          >
            {[
              { label: 'AI Diagnostic Reports', val: '120k+', icon: Brain, color: 'text-blue-400' },
              { label: 'Global Job Listings', val: '4.8k+', icon: Briefcase, color: 'text-purple-400' },
              { label: 'Interview Pass Rate', val: '92.4%', icon: Target, color: 'text-emerald-400' },
              { label: 'Average Salary Hike', val: '65%', icon: Star, color: 'text-orange-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-8 text-center space-y-3 group hover:border-primary/40 transition-all bg-dark-950/40">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold tracking-tight">{stat.val}</div>
                <div className="text-[10px] text-text-muted font-black uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Feature Grid */}
        <section id="features" className="mt-48">
          <div className="text-center mb-20">
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Engineered for Success</span>
            <h2 className="text-4xl sm:text-6xl font-display font-bold mb-6 tracking-tight">Industrial Grade Tools</h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">Everything you need to navigate the modern job market with confidence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Resume Analyser', desc: 'Instant ATS scoring and deep skill-gap analysis with actionable improvement suggestions based on real job data.', icon: Zap, color: 'from-blue-500/20 to-indigo-500/20 text-blue-400' },
              { title: 'Mock Interviews', desc: 'Simulate high-pressure interviews with specialized AI bots trained on industry-specific question banks.', icon: Sparkles, color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
              { title: 'Learning Paths', desc: 'Dynamic skill-building roadmaps that evolve as you progress, ensuring you stay ahead of industry trends.', icon: GraduationCap, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-10 group cursor-default hover:border-primary/50 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:rotate-12 transition-all ${f.color.split(' ')[2]}`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed font-medium">{f.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Premium Footer */}
      <footer className="mt-20 border-t border-white/5 bg-dark-950/40 backdrop-blur-xl py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <h4 className="font-display text-2xl font-bold mb-6">Place<span className="gradient-text">AI</span></h4>
            <p className="text-text-muted text-sm max-w-sm leading-relaxed mb-8">
              Empowering students and job seekers with the world's most advanced AI-driven placement infrastructure.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 cursor-pointer transition-all"><Star className="w-4 h-4" /></div>)}
            </div>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-6">Product</h5>
            <ul className="space-y-4 text-sm text-text-muted">
              {['Features', 'Interview Prep', 'Resume Analysis', 'Job Board'].map(l => <li key={l} className="hover:text-primary cursor-pointer transition-colors">{l}</li>)}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-6">Company</h5>
            <ul className="space-y-4 text-sm text-text-muted">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Support'].map(l => <li key={l} className="hover:text-primary cursor-pointer transition-colors">{l}</li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">© 2026 PlaceAI System Architecture</p>
          <div className="flex gap-8">
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow shadow-emerald-500/50" /> System Status: Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
