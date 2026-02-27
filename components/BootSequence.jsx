import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ThreeBackground } from './ThreeBackground';

const LOGS = [
  { text: 'Initializing SpyOS Kernel v4.2...', type: 'info' },
  { text: 'Verifying cryptographic signatures... [PASS]', type: 'ok' },
  { text: 'Loading secure memory partitions...', type: 'info' },
  { text: 'Mounting encrypted file systems... [OK]', type: 'ok' },
  { text: 'Establishing quantum-encrypted tunnel...', type: 'info' },
  { text: 'Bypassing perimeter firewalls... [DONE]', type: 'ok' },
  { text: 'Decrypting agent identity matrix...', type: 'warn' },
  { text: 'Identity verified. Clearance Level: OMEGA', type: 'ok' },
  { text: 'Launching SpyOS Desktop Environment...', type: 'info' },
  { text: '[ ACCESS GRANTED ]', type: 'success' },
];

const typeColor = {
  info: '#00b36b',
  ok: '#00ff9d',
  warn: '#ffc107',
  success: '#00e5ff',
};

export const BootSequence = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);

  const timestamp = useMemo(() => new Date().toLocaleTimeString(), []);

  useEffect(() => {
    if (lineIndex >= LOGS.length) {
      const timer = setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 600);
      }, 700);
      return () => clearTimeout(timer);
    }

    const current = LOGS[lineIndex].text;

    if (charIndex < current.length) {
      const timer = setTimeout(
        () => setCharIndex((p) => p + 1),
        prefersReducedMotion ? 4 : (LOGS[lineIndex].type === 'success' ? 35 : 16)
      );
      return () => clearTimeout(timer);
    }

    const pause = setTimeout(() => {
      setVisibleLines((p) => [...p, LOGS[lineIndex]]);
      setLineIndex((p) => p + 1);
      setCharIndex(0);
    }, prefersReducedMotion ? 20 : (LOGS[lineIndex].type === 'success' ? 400 : 100));

    return () => clearTimeout(pause);
  }, [charIndex, lineIndex, onComplete, prefersReducedMotion]);

  const activeLine = lineIndex < LOGS.length ? LOGS[lineIndex].text.slice(0, charIndex) : '';
  const activeType = lineIndex < LOGS.length ? LOGS[lineIndex].type : 'info';
  const progress = Math.round((lineIndex / LOGS.length) * 100);

  return (
    <motion.div
      className="h-screen w-screen relative overflow-hidden flex flex-col"
      animate={done ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeIn' }}
    >
      {/* 3D background */}
      <ThreeBackground />

      {/* Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none scanlines" />

      {/* Boot glow */}
      <div className="absolute inset-0 z-10 boot-flicker pointer-events-none" />

      {/* ── HUD Header ── */}
      <div className="relative z-20 flex items-center justify-between px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          {/* Hex logo */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div
              className="hex-rotate absolute inset-0"
              style={{
                background: 'conic-gradient(from 0deg, #00ff9d22, #00e5ff44, #00ff9d22)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            />
            <span className="font-mono text-[10px] font-bold" style={{ color: '#00ff9d' }}>SPY</span>
          </div>
          <div>
            <div className="font-mono text-xs font-bold tracking-[0.3em]" style={{ color: '#00ff9d' }}>SpyOS // v4.2.1</div>
            <div className="font-mono text-[9px] opacity-50">KERNEL BOOT SEQUENCE</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-right font-mono text-[10px] opacity-50"
        >
          <div>SYS_TIME: {timestamp}</div>
          <div>NODE: SECURE_SRV_07</div>
        </motion.div>
      </div>

      {/* ── Main log area ── */}
      <div className="relative z-20 flex-1 flex flex-col justify-end px-8 pb-6">
        {/* Log lines */}
        <div className="space-y-1 mb-4 max-h-[60vh] overflow-hidden">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={`${i}-${line.text}`}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="font-mono text-sm flex items-start gap-3"
              >
                <span className="opacity-40 shrink-0 text-[11px] mt-0.5">[{timestamp}]</span>
                <span style={{ color: typeColor[line.type] }}>{line.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Active typing line */}
          {lineIndex < LOGS.length && (
            <div className="font-mono text-sm flex items-start gap-3">
              <span className="opacity-40 shrink-0 text-[11px] mt-0.5">[{timestamp}]</span>
              <span style={{ color: typeColor[activeType] }}>
                {activeLine}
                <span className="cursor-blink">█</span>
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <div className="flex justify-between font-mono text-[10px] opacity-60">
            <span>BOOT_PROGRESS</span>
            <span>{progress}%</span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #004d30, #00ff9d, #00e5ff)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Bottom status row */}
          <div className="flex items-center justify-between text-[10px] font-mono opacity-40 pt-2">
            <span>UEFI SECURE BOOT // TLS 1.3 // AES-256-GCM</span>
            <span>CPU: SRV-X7 // MEM: 32GB ECC</span>
          </div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-20 left-4', 'bottom-20 right-4'].map((pos, i) => (
        <div key={i} className={`absolute z-20 w-4 h-4 pointer-events-none ${pos}`}
          style={{
            borderTop: i < 2 ? '1px solid rgba(0,255,157,0.4)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(0,255,157,0.4)' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid rgba(0,255,157,0.4)' : 'none',
            borderRight: i % 2 === 1 ? '1px solid rgba(0,255,157,0.4)' : 'none',
          }}
        />
      ))}
    </motion.div>
  );
};
