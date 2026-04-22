import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ShieldCheck, Lock, BrainCircuit } from 'lucide-react';

export default function AICaptcha({ onVerify }) {
  const [isVerified, setIsVerified] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [targetValue, setTargetValue] = useState(Math.floor(Math.random() * 40) + 60); // 60-100 range
  const controls = useAnimation();
  const trackRef = useRef(null);

  useEffect(() => {
    if (sliderValue >= targetValue - 2 && sliderValue <= targetValue + 2) {
      setIsVerified(true);
      onVerify(true);
    }
  }, [sliderValue, targetValue, onVerify]);

  const handleSliderChange = (e) => {
    if (isVerified) return;
    setSliderValue(parseInt(e.target.value));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
        <span>AI Security Verification</span>
        <span className={isVerified ? "text-emerald-400" : "text-primary"}>
          {isVerified ? "Verification Successful" : "Slide to Authenticate"}
        </span>
      </div>

      <div className="relative group">
        <div 
          ref={trackRef}
          className="h-14 bg-slate-950/50 border border-white/5 rounded-2xl overflow-hidden relative flex items-center justify-center"
        >
          {/* Target Zone Indicator */}
          <div 
            className="absolute h-full bg-primary/10 border-x border-primary/20"
            style={{ 
              left: `${targetValue}%`, 
              width: '12%',
              transform: 'translateX(-50%)'
            }}
          />

          {/* Progress Fill */}
          <motion.div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/20 to-secondary/20"
            style={{ width: `${sliderValue}%` }}
          />

          {/* Label */}
          <div className="relative z-10 pointer-events-none flex items-center gap-2 text-xs font-bold text-slate-400">
            {isVerified ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Human Identity Confirmed
              </motion.div>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 animate-pulse" />
                Solve Neural Connection
              </>
            )}
          </div>

          <input 
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${isVerified ? 'pointer-events-none' : ''}`}
          />
        </div>

        {/* Handle Visual */}
        {!isVerified && (
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl pointer-events-none"
            style={{ left: `calc(${sliderValue}% - 24px)`, marginLeft: sliderValue < 5 ? '24px' : '0' }}
          >
            <Lock className="w-5 h-5 text-slate-900" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
