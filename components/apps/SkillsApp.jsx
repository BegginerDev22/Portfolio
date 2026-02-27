import React, { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../../constants';
import { motion } from 'framer-motion';

// Mini radar chart rendered on canvas
const RadarChart = ({ skills }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) / 2 - 20;
    const n = skills.length;

    ctx.clearRect(0, 0, W, H);

    // Draw grid rings
    for (let ring = 1; ring <= 4; ring++) {
      const r = (ring / 4) * R;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,77,48,0.5)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
      ctx.strokeStyle = 'rgba(0,77,48,0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    skills.forEach((skill, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = (skill.level / 100) * R;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(0,255,157,0.25)');
    grad.addColorStop(1, 'rgba(0,229,255,0.08)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots
    skills.forEach((skill, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = (skill.level / 100) * R;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff9d';
      ctx.fill();
    });

    // Labels
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    skills.forEach((skill, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const lr = R + 16;
      const x = cx + lr * Math.cos(angle);
      const y = cy + lr * Math.sin(angle);
      ctx.fillStyle = 'rgba(0,255,157,0.6)';
      ctx.fillText(skill.name, x, y);
    });
  }, [skills]);

  return <canvas ref={canvasRef} width={200} height={200} className="w-full" />;
};

export const SkillsApp = () => {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const category = SKILLS[activeCategory];

  return (
    <div className="font-mono text-green-400 space-y-4">

      {/* Header */}
      <div className="pb-3" style={{ borderBottom: '1px solid rgba(0,255,157,0.15)' }}>
        <h2 className="text-lg font-bold tracking-widest text-white">OPERATIVE_CAPABILITIES</h2>
        <p className="text-[10px]" style={{ color: 'rgba(0,255,157,0.4)' }}>PROFICIENCY MATRIX // CLASSIFIED DATA</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {SKILLS.map((cat, i) => (
          <motion.button
            key={cat.name}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveCategory(i)}
            className="px-2 py-1 text-[9px] font-bold tracking-widest rounded-lg transition-all duration-200"
            style={{
              background: activeCategory === i ? 'rgba(0,255,157,0.15)' : 'rgba(0,0,0,0.3)',
              border: activeCategory === i ? '1px solid rgba(0,255,157,0.5)' : '1px solid rgba(0,255,157,0.1)',
              color: activeCategory === i ? '#00ff9d' : 'rgba(0,255,157,0.4)',
            }}
          >
            {cat.name.replace(/_/g, ' ')}
          </motion.button>
        ))}
      </div>

      {/* Content for active category */}
      <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: '1fr auto' }}>
        {/* Bar chart */}
        <div className="space-y-3">
          {category.skills.map((skill, j) => {
            const delay = j * 120;
            return (
              <div key={skill.name} className="group">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{skill.name}</span>
                  <span className="font-bold" style={{ color: '#00ff9d' }}>{skill.level}%</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden relative"
                  style={{ background: 'rgba(0,77,48,0.25)', border: '1px solid rgba(0,77,48,0.5)' }}
                >
                  {/* Background pulse */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0, 0.08, 0] }}
                    transition={{ duration: 2 + j * 0.3, repeat: Infinity, delay: j * 0.4 }}
                    style={{ background: '#00ff9d' }}
                  />
                  {/* Bar */}
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{ background: `linear-gradient(90deg, #004d30, #00ff9d ${skill.level}%, #00e5ff)` }}
                    initial={{ width: '0%' }}
                    animate={{ width: mounted ? `${skill.level}%` : '0%' }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
                  >
                    {/* Leading edge */}
                    <div className="absolute top-0 right-0 bottom-0 w-0.5 rounded-r-full"
                      style={{ background: '#fff', boxShadow: '0 0 6px #00ff9d, 0 0 12px #00ff9d' }} />
                    {/* Scan sweep */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: j * 0.2 + 1, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar chart — only show on wide enough panels */}
        <div className="hidden md:block w-[200px] shrink-0">
          <RadarChart skills={category.skills} />
        </div>
      </div>
    </div>
  );
};