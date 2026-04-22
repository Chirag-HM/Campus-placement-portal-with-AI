import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Target, ArrowRight, Brain, Briefcase, GraduationCap } from 'lucide-react';

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative isolate">
      {/* Background Orbs */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-primary mb-8 animate-shimmer">
            <Sparkles className="w-4 h-4" />
            POWERED BY GEMINI 2.0 FLASH
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl sm:text-7xl font-display font-bold tracking-tight mb-8">
            The Future of <br />
            <span className="gradient-text">Campus Placements</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Bridge the gap between education and employment with AI-driven resume analysis, real-time mock interviews, and personalized career roadmaps.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/login" className="btn-primary py-4 px-8 text-lg">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-semibold">
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        {/* Dynamic Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-24"
        >
          {[
            { label: 'AI Analyses', val: '50k+', icon: Brain },
            { label: 'Active Jobs', val: '2.5k+', icon: Briefcase },
            { label: 'Success Rate', val: '94%', icon: Target },
            { label: 'Students', val: '100k+', icon: GraduationCap },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center space-y-2 group hover:scale-105 transition-all">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <div className="text-2xl sm:text-3xl font-display font-bold">{stat.val}</div>
              <div className="text-xs text-text-muted uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature Grid */}
        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Powerful AI Tools</h2>
            <p className="text-text-secondary max-w-xl mx-auto">Everything you need to land your dream job, all in one platform.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Resume Analyser', desc: 'Instant ATS scoring and deep skill-gap analysis with actionable improvement suggestions.', icon: Zap, color: 'text-blue-400' },
              { title: 'Mock Interviews', desc: 'Practice with real-time AI interviewers that evaluate your technical and soft skills.', icon: Sparkles, color: 'text-purple-400' },
              { title: 'Learning Paths', desc: 'AI-generated 8-week roadmaps tailored to your specific career goals and skill gaps.', icon: GraduationCap, color: 'text-emerald-400' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group cursor-default hover:border-primary/30"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer-like Section */}
      <div className="border-t border-white/5 bg-white/[0.01] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-muted text-sm">
          © 2026 PlaceAI. Built for the next generation of talent.
        </div>
      </div>
    </div>
  );
}
