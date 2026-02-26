import React, { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, Database, Wifi } from 'lucide-react';
import { motion, useReducedMotion } from 'https://esm.sh/framer-motion@11.11.17';
import { STATUS_COLORS, UI_TOKENS } from '../constants';

export const SystemMonitor = () => {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef(null);
  const [cpuLoad, setCpuLoad] = useState(30);
  const [ramLoad, setRamLoad] = useState(45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dataPoints = Array(64).fill(45);
    let animationId = 0;
    let frame = 0;

    const draw = () => {
      frame += 1;

      if (frame % 2 === 0) {
        dataPoints.shift();
        const last = dataPoints[dataPoints.length - 1];
        const noise = (Math.random() - 0.5) * (prefersReducedMotion ? 6 : 12);
        const target = Math.max(8, Math.min(92, last + noise));
        const smooth = last + (target - last) * 0.55;
        dataPoints.push(smooth);
      }

      if (frame % 24 === 0) {
        setCpuLoad(prev => Math.max(8, Math.min(96, prev + (Math.random() - 0.5) * 16)));
        setRamLoad(prev => Math.max(20, Math.min(88, prev + (Math.random() - 0.5) * 8)));
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#05340f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      ctx.strokeStyle = '#00ff99';
      ctx.lineWidth = 2;
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const x = (i / (dataPoints.length - 1)) * canvas.width;
        const y = canvas.height - (point / 100) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.fillStyle = 'rgba(0, 255, 153, 0.12)';
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [prefersReducedMotion]);

  return (
    <div className={`fixed right-4 top-20 w-64 ${UI_TOKENS.glass.depthMid} border border-green-900/50 p-4 hidden lg:flex flex-col gap-4 font-mono select-none z-0 pointer-events-none`}>
      <div className="flex justify-between items-center border-b border-green-800 pb-1">
        <span className="text-xs text-green-500 font-bold tracking-[0.16em]">SYSTEM_MONITOR</span>
        <Activity size={12} className="text-green-400 animate-pulse" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-green-300">
          <span className="flex items-center gap-1"><Wifi size={10} /> UPLINK_TRAFFIC</span>
          <span className={STATUS_COLORS.decrypted.text}>2.4 GB/s</span>
        </div>
        <canvas ref={canvasRef} width={220} height={60} className="border border-green-900/50 w-full" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-green-300">
          <span className="flex items-center gap-1"><Cpu size={10} /> CPU_CORE_01</span>
          <span>{Math.round(cpuLoad)}%</span>
        </div>
        <div className="h-2 bg-green-900/30 border border-green-900 w-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: `${cpuLoad}%` }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-green-300">
          <span className="flex items-center gap-1"><Database size={10} /> MEMORY_ALLOC</span>
          <span>{Math.round(ramLoad)}%</span>
        </div>
        <div className="h-2 bg-green-900/30 border border-green-900 w-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400"
            animate={{ width: `${ramLoad}%` }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>

      <motion.div
        className="text-[10px] text-green-800 text-center mt-2 border-t border-green-900/50 pt-2"
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        SECURE_SERVER_NODE_X7
      </motion.div>
    </div>
  );
};
