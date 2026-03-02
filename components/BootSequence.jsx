import React, { useEffect, useMemo, useRef, useState } from 'react';
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

// 🔥 GLOBAL SPEED CONTROL (lower = faster)
const SPEED_MULTIPLIER = 0.5;

export const BootSequence = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);

  const completionRef = useRef(null);
  const timestamp = useMemo(() => new Date().toLocaleTimeString(), []);

  useEffect(() => {
    if (lineIndex >= LOGS.length) {
      const timer = setTimeout(() => {
        setDone(true);

        completionRef.current = setTimeout(() => {
          onComplete?.();
        }, 250 * SPEED_MULTIPLIER);
      }, 250 * SPEED_MULTIPLIER);

      return () => {
        clearTimeout(timer);
        if (completionRef.current) clearTimeout(completionRef.current);
      };
    }

    const current = LOGS[lineIndex].text;

    // ✨ Character typing with jitter (more realistic)
    if (charIndex < current.length) {
      const base =
        LOGS[lineIndex].type === 'success' ? 14 : 6;

      const jitter = Math.random() * 6;

      const timer = setTimeout(
        () => setCharIndex((p) => p + 1),
        prefersReducedMotion
          ? 2
          : (base + jitter) * SPEED_MULTIPLIER
      );

      return () => clearTimeout(timer);
    }

    // ⏸ Pause between lines
    const pauseBase =
      LOGS[lineIndex].type === 'success' ? 150 : 40;

    const pause = setTimeout(() => {
      setVisibleLines((p) => [...p, LOGS[lineIndex]]);
      setLineIndex((p) => p + 1);
      setCharIndex(0);
    }, prefersReducedMotion ? 10 : pauseBase * SPEED_MULTIPLIER);

    return () => clearTimeout(pause);
  }, [charIndex, lineIndex, onComplete, prefersReducedMotion]);

  const activeLine =
    lineIndex < LOGS.length
      ? LOGS[lineIndex].text.slice(0, charIndex)
      : '';

  const activeType =
    lineIndex < LOGS.length
      ? LOGS[lineIndex].type
      : 'info';

  // 🔥 Smooth live progress (updates while typing)
  const progress =
    lineIndex < LOGS.length
      ? Math.round(
        (
          (lineIndex +
            charIndex /
            (LOGS[lineIndex]?.text.length || 1)) /
          LOGS.length
        ) *
        100
      )
      : 100;

  return (
    <motion.div
      className="h-screen w-screen relative overflow-hidden flex flex-col"
      animate={done ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeIn' }}
    >
      <ThreeBackground />

      <div className="absolute inset-0 z-10 pointer-events-none scanlines" />
      <div className="absolute inset-0 z-10 boot-flicker pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-6">
        <div className="font-mono text-xs tracking-widest text-[#00ff9d]">
          SpyOS // v4.2.1
        </div>

        <div className="font-mono text-[10px] opacity-50 text-right">
          <div>SYS_TIME: {timestamp}</div>
          <div>NODE: SECURE_SRV_07</div>
        </div>
      </div>

      {/* ── LOG AREA ── */}
      <div className="relative z-20 flex-1 flex flex-col justify-end px-6 pb-6">
        <div className="space-y-1 mb-4 max-h-[60vh] overflow-hidden">
          <AnimatePresence>
            {visibleLines.map((line, i) => {
              const isSuccess = line.type === 'success';

              return (
                <motion.div
                  key={`${i}-${line.text}`}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-mono text-sm flex items-start gap-3"
                >
                  <span className="opacity-40 text-[10px] hidden sm:inline">
                    [{timestamp}]
                  </span>

                  {isSuccess ? (
                    <motion.span
                      style={{ color: typeColor[line.type] }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 1, 0.6, 1],
                        textShadow: [
                          '0 0 2px #00e5ff',
                          '0 0 10px #00e5ff',
                          '0 0 4px #00e5ff',
                        ],
                        x: [0, -2, 2, -1, 0],
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {line.text}
                    </motion.span>
                  ) : (
                    <span style={{ color: typeColor[line.type] }}>
                      {line.text}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Active typing line */}
          {lineIndex < LOGS.length && (
            <div className="font-mono text-sm flex items-start gap-3">
              <span className="opacity-40 text-[10px] hidden sm:inline">
                [{timestamp}]
              </span>

              <span style={{ color: typeColor[activeType] }}>
                {activeLine}
                <span className="cursor-blink">█</span>
              </span>
            </div>
          )}
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-[10px] opacity-60">
            <span>BOOT_PROGRESS</span>
            <span>{progress}%</span>
          </div>

          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{
              background: 'rgba(0,255,157,0.1)',
              border: '1px solid rgba(0,255,157,0.2)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #004d30, #00ff9d, #00e5ff)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono opacity-40 pt-2">
            <span>UEFI SECURE BOOT // TLS 1.3 // AES-256</span>
            <span>CPU: SRV-X7 // MEM: 32GB ECC</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};