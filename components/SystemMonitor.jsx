import React, { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, Database, Wifi, Server } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export const SystemMonitor = () => {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef(null);
  const [cpuLoad, setCpuLoad] = useState(34);
  const [ramLoad, setRamLoad] = useState(51);
  const [netLoad, setNetLoad] = useState(2.4);
  const [uptimeSec, setUptimeSec] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptimeSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatUptime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dataPoints = Array(80).fill(40);
    let animId = 0;
    let frame = 0;

    const draw = () => {
      frame++;

      if (frame % 2 === 0) {
        dataPoints.shift();
        const last = dataPoints[dataPoints.length - 1];
        const noise = (Math.random() - 0.5) * (prefersReducedMotion ? 5 : 14);
        const next = Math.max(6, Math.min(94, last + noise));
        dataPoints.push(last + (next - last) * 0.6);
      }

      if (frame % 28 === 0) {
        setCpuLoad(p => Math.max(8, Math.min(96, p + (Math.random() - 0.5) * 18)));
        setRamLoad(p => Math.max(20, Math.min(88, p + (Math.random() - 0.5) * 8)));
        setNetLoad(p => parseFloat(Math.max(0.1, Math.min(9.9, p + (Math.random() - 0.5) * 1.2)).toFixed(1)));
      }

      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(0,77,48,0.35)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < W; x += 16) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y < H; y += 12) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      // Area fill
      ctx.beginPath();
      dataPoints.forEach((pt, i) => {
        const x = (i / (dataPoints.length - 1)) * W;
        const y = H - (pt / 100) * H;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, 'rgba(0,255,157,0.2)');
      grad.addColorStop(1, 'rgba(0,255,157,0.01)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      dataPoints.forEach((pt, i) => {
        const x = (i / (dataPoints.length - 1)) * W;
        const y = H - (pt / 100) * H;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#00ff9d';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00ff9d';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion]);

  const MeterBar = ({ value, color = '#00ff9d', label, suffix = '%', icon: Icon }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="flex items-center gap-1" style={{ color: 'rgba(0,255,157,0.6)' }}>
          {Icon && <Icon size={9} />} {label}
        </span>
        <motion.span
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color }}
        >
          {typeof value === 'number' ? (suffix === '%' ? Math.round(value) : value) : value}{suffix}
        </motion.span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: 'rgba(0,77,48,0.3)', border: '1px solid rgba(0,77,48,0.5)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="fixed right-4 top-4 w-60 hidden lg:flex flex-col gap-3 font-mono select-none z-[5] pointer-events-none"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(0,255,157,0.15)',
        borderRadius: '10px',
        padding: '14px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,255,157,0.02)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'rgba(0,255,157,0.12)' }}>
        <div className="flex items-center gap-1.5">
          <Server size={11} style={{ color: '#00ff9d' }} />
          <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: '#00ff9d' }}>
            SYS_MONITOR
          </span>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Activity size={11} style={{ color: '#00ff9d' }} />
        </motion.div>
      </div>

      {/* Canvas graph */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px]" style={{ color: 'rgba(0,229,255,0.6)' }}>
          <span className="flex items-center gap-1"><Wifi size={9} /> NET_TRAFFIC</span>
          <span style={{ color: '#00e5ff' }}>{netLoad} GB/s</span>
        </div>
        <canvas
          ref={canvasRef}
          width={200} height={52}
          className="w-full rounded"
          style={{ border: '1px solid rgba(0,77,48,0.4)', background: 'rgba(0,0,0,0.4)' }}
        />
      </div>

      {/* CPU */}
      <MeterBar value={cpuLoad} label="CPU_CORE_01" icon={Cpu} />
      {/* RAM */}
      <MeterBar value={ramLoad} label="MEMORY_ALLOC" color="#00e5ff" icon={Database} />

      {/* Uptime */}
      <div className="border-t pt-2 flex justify-between text-[9px]" style={{ borderColor: 'rgba(0,255,157,0.1)', color: 'rgba(0,255,157,0.35)' }}>
        <span>UPTIME</span>
        <span>{formatUptime(uptimeSec)}</span>
      </div>
    </div>
  );
};
