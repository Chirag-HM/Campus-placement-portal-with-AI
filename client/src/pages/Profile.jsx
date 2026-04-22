import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { User, Save, Loader2, Globe, Plus, X, ExternalLink } from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    college: user?.college || '', branch: user?.branch || '',
    graduationYear: user?.graduationYear || '', cgpa: user?.cgpa || '',
    phone: user?.phone || '', skills: user?.skills || [],
    linkedIn: user?.linkedIn || '', github: user?.github || '', portfolio: user?.portfolio || '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/user/profile', form);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setForm(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-8"><span className="gradient-text">Profile</span></h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
            alt={user?.name} className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
            <p className="text-text-secondary text-sm">{user?.email}</p>
            <span className="badge badge-blue mt-1 text-[10px] capitalize">{user?.role}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium mb-1.5">College</label>
            <input value={form.college} onChange={e => setForm(p => ({ ...p, college: e.target.value }))} className="input-field" placeholder="Your college" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Branch</label>
            <input value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} className="input-field" placeholder="e.g. CSE" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Graduation Year</label>
            <input type="number" value={form.graduationYear} onChange={e => setForm(p => ({ ...p, graduationYear: e.target.value }))} className="input-field" placeholder="2025" /></div>
          <div><label className="block text-sm font-medium mb-1.5">CGPA</label>
            <input type="number" step="0.01" value={form.cgpa} onChange={e => setForm(p => ({ ...p, cgpa: e.target.value }))} className="input-field" placeholder="8.5" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Phone</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="+91..." /></div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">Skills</label>
          <div className="flex gap-2 mb-2">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="input-field flex-1" placeholder="Add a skill..." />
            <button onClick={addSkill} className="btn-secondary p-2.5"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map(s => (
              <span key={s} className="badge badge-blue flex items-center gap-1">
                {s} <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-text-muted shrink-0" />
            <input value={form.linkedIn} onChange={e => setForm(p => ({ ...p, linkedIn: e.target.value }))} className="input-field" placeholder="LinkedIn URL" />
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-text-muted shrink-0" />
            <input value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} className="input-field" placeholder="GitHub URL" />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-text-muted shrink-0" />
            <input value={form.portfolio} onChange={e => setForm(p => ({ ...p, portfolio: e.target.value }))} className="input-field" placeholder="Portfolio URL" />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center py-3">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            : saved ? <><Save className="w-5 h-5" /> Saved!</>
            : <><Save className="w-5 h-5" /> Save Profile</>}
        </button>
      </motion.div>
    </div>
  );
}
