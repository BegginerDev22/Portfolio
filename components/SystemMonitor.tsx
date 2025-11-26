import React, { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, Database, Wifi } from 'lucide-react';

export const SystemMonitor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cpuLoad, setCpuLoad] = useState(30);
  const [ramLoad, setRamLoad] = useState(45);

  useEffect(() => {
    // Canvas setup for Network Graph
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dataPoints: number[] = Array(50).fill(50);
    let animationId: number;
    let frame = 0;

    const draw = () => {
      frame++;
      
      // Update fake data occasionally
      if (frame % 3 === 0) {
        dataPoints.shift();
        const last = dataPoints[dataPoints.length - 1];
        // Random walk
        let next = last + (Math.random() - 0.5) * 20;
        next = Math.max(10, Math.min(90, next));
        dataPoints.push(next);
      }

      // Update Resources occasionally
      if (frame % 30 === 0) {
        setCpuLoad(prev => Math.max(10, Math.min(95, prev + (Math.random() - 0.5) * 20)));
        setRamLoad(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 10)));
      }

      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#003300';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw Graph
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      ctx.beginPath();
      dataPoints.forEach((point, i) => {
        const x = (i / (dataPoints.length - 1)) * canvas.width;
        const y = canvas.height - (point / 100) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Fill below
      ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="fixed right-4 top-20 w-64 bg-black/80 border border-green-900/50 p-4 hidden lg:flex flex-col gap-4 font-mono select-none z-0 backdrop-blur-sm pointer-events-none">
      <div className="flex justify-between items-center border-b border-green-800 pb-1">
        <span className="text-xs text-green-600 font-bold">SYSTEM_MONITOR</span>
        <Activity size={12} className="text-green-500 animate-pulse" />
      </div>

      {/* Network Graph */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-green-400">
            <span className="flex items-center gap-1"><Wifi size={10}/> UPLINK_TRAFFIC</span>
            <span>2.4 GB/s</span>
        </div>
        <canvas ref={canvasRef} width={220} height={60} className="border border-green-900/50 w-full" />
      </div>

      {/* CPU */}
      <div className="space-y-1">
         <div className="flex justify-between text-[10px] text-green-400">
            <span className="flex items-center gap-1"><Cpu size={10}/> CPU_CORE_01</span>
            <span>{Math.round(cpuLoad)}%</span>
        </div>
        <div className="h-2 bg-green-900/30 border border-green-900 w-full overflow-hidden">
             <div 
               className="h-full bg-green-500 transition-all duration-500 ease-out"
               style={{ width: `${cpuLoad}%` }}
             />
        </div>
      </div>

      {/* RAM */}
      <div className="space-y-1">
         <div className="flex justify-between text-[10px] text-green-400">
            <span className="flex items-center gap-1"><Database size={10}/> MEMORY_ALLOC</span>
            <span>{Math.round(ramLoad)}%</span>
        </div>
        <div className="h-2 bg-green-900/30 border border-green-900 w-full overflow-hidden">
             <div 
               className="h-full bg-green-500 transition-all duration-500 ease-out"
               style={{ width: `${ramLoad}%` }}
             />
        </div>
      </div>

      <div className="text-[10px] text-green-800 text-center mt-2 border-t border-green-900/50 pt-2">
         SECURE_SERVER_NODE_X7
      </div>
    </div>
  );
};