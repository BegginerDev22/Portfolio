import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'https://esm.sh/framer-motion@11.11.17';

const LOGS = [
  'Initializing BIOS...',
  'Checking memory integrity... OK',
  'Loading SpyOS Kernel v3.7...',
  'Mounting file systems...',
  'Decrypting user keys...',
  'Establishing secure connection to HQ...',
  'Bypassing firewalls...',
  'Access Granted.',
];

export const BootSequence = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);

  const timestamp = useMemo(() => new Date().toLocaleTimeString(), []);

  useEffect(() => {
    if (lineIndex >= LOGS.length) {
      const timer = setTimeout(onComplete, 850);
      return () => clearTimeout(timer);
    }

    const current = LOGS[lineIndex];

    if (charIndex < current.length) {
      const timer = setTimeout(() => setCharIndex(prev => prev + 1), prefersReducedMotion ? 6 : 18);
      return () => clearTimeout(timer);
    }

    const linePause = setTimeout(() => {
      setVisibleLines(prev => [...prev, current]);
      setLineIndex(prev => prev + 1);
      setCharIndex(0);
    }, prefersReducedMotion ? 30 : 120);

    return () => clearTimeout(linePause);
  }, [charIndex, lineIndex, onComplete, prefersReducedMotion]);

  const activeLine = lineIndex < LOGS.length ? LOGS[lineIndex].slice(0, charIndex) : '';

  return (
    <div className="h-screen w-screen bg-black text-green-500 p-8 font-mono text-lg flex flex-col justify-end pb-20 scanlines relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none boot-flicker" />
      {visibleLines.map((line, i) => (
        <motion.div
          key={`${line}-${i}`}
          className="mb-2"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.08 : 0.2 }}
        >
          <span className="text-green-800 mr-2">[{timestamp}]</span>
          {line}
        </motion.div>
      ))}
      {lineIndex < LOGS.length && (
        <div className="mb-2">
          <span className="text-green-800 mr-2">[{timestamp}]</span>
          {activeLine}
        </div>
      )}
      <div className="animate-pulse">_</div>
    </div>
  );
};
