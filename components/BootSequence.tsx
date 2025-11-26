import React, { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

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

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= LOGS.length) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }

    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, LOGS[index]]);
      setIndex((prev) => prev + 1);
    }, Math.random() * 400 + 100);

    return () => clearTimeout(timeout);
  }, [index, onComplete]);

  return (
    <div className="h-screen w-screen bg-black text-green-500 p-8 font-mono text-lg flex flex-col justify-end pb-20 scanlines">
      {lines.map((line, i) => (
        <div key={i} className="mb-2">
          <span className="text-green-800 mr-2">[{new Date().toLocaleTimeString()}]</span>
          {line}
        </div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
};
