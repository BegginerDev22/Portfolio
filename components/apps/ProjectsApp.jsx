import React, { useState } from 'react';
import { PROJECTS } from '../../constants';
import { Lock, Unlock, ShieldAlert, ExternalLink, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectsApp = () => {
  const [projects, setProjects] = useState(PROJECTS);
  const [decrypting, setDecrypting] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleDecrypt = (id, e) => {
    e.stopPropagation();
    setDecrypting(id);
    setTimeout(() => {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'DECRYPTED' } : p));
      setDecrypting(null);
    }, 1400);
  };

  return (
    <div className="font-mono text-green-400 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-3"
        style={{ borderBottom: '1px solid rgba(0,255,157,0.15)' }}>
        <div>
          <h2 className="text-lg font-bold tracking-widest text-white">MISSION_FILES</h2>
          <p className="text-[10px]" style={{ color: 'rgba(0,255,157,0.4)' }}>
            CLEARANCE: TOP SECRET // {projects.filter(p => p.status === 'DECRYPTED').length}/{projects.length} DECRYPTED
          </p>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ShieldAlert size={20} style={{ color: 'rgba(255,193,7,0.8)' }} />
        </motion.div>
      </div>

      {/* Grid */}
      <div className="space-y-3">
        {projects.map((project, i) => {
          const isDecrypted = project.status === 'DECRYPTED';
          const isDecrypting = decrypting === project.id;
          const isSelected = selected === project.id;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelected(isSelected ? null : project.id)}
              className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                background: isSelected
                  ? 'rgba(0,77,48,0.25)'
                  : 'rgba(0,0,0,0.35)',
                border: isSelected
                  ? '1px solid rgba(0,255,157,0.4)'
                  : '1px solid rgba(0,255,157,0.1)',
                boxShadow: isSelected ? '0 0 20px rgba(0,255,157,0.08)' : 'none',
              }}
            >
              {/* Decrypting overlay */}
              <AnimatePresence>
                {isDecrypting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                        className="text-sm font-bold mb-1"
                        style={{ color: '#00ff9d' }}
                      >
                        DECRYPTING...
                      </motion.div>
                      <div className="text-[9px]" style={{ color: 'rgba(0,255,157,0.4)' }}>
                        AES-256 // CRACKING CIPHER...
                      </div>
                      {/* Fake progress */}
                      <motion.div
                        className="mt-2 h-0.5 rounded-full"
                        style={{ background: 'rgba(0,255,157,0.2)', width: 120 }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: '#00ff9d' }}
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main row */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="text-[9px] mb-0.5" style={{ color: 'rgba(0,255,157,0.4)' }}>
                      CODENAME:
                    </div>
                    <h3 className="text-sm font-bold tracking-widest text-white truncate">
                      {project.codename}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status badge */}
                    {isDecrypted ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] rounded-full font-bold"
                        style={{ background: 'rgba(0,255,157,0.12)', border: '1px solid rgba(0,255,157,0.35)', color: '#00ff9d' }}>
                        <Unlock size={8} /> DECRYPTED
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleDecrypt(project.id, e)}
                        className="flex items-center gap-1 px-2 py-0.5 text-[9px] rounded-full font-bold"
                        style={{ background: 'rgba(255,69,96,0.12)', border: '1px solid rgba(255,69,96,0.4)', color: '#ff4560' }}
                      >
                        <Lock size={8} /> CLASSIFIED
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pt-2" style={{ borderTop: '1px solid rgba(0,255,157,0.08)' }}>
                        <div className="text-xs">
                          <span style={{ color: 'rgba(0,255,157,0.4)' }}>CLIENT: </span>
                          {isDecrypted
                            ? <span className="text-white">{project.client}</span>
                            : <span className="px-2 rounded" style={{ background: 'rgba(0,77,48,0.4)', color: 'transparent', userSelect: 'none' }}>REDACTED_STRING</span>
                          }
                        </div>
                        <div className="text-xs leading-relaxed">
                          <span style={{ color: 'rgba(0,255,157,0.4)' }}>BRIEF: </span>
                          {isDecrypted
                            ? <span style={{ color: 'rgba(255,255,255,0.85)' }}>{project.description}</span>
                            : <span style={{ filter: 'blur(4px)', color: 'rgba(0,255,157,0.6)', userSelect: 'none' }}>
                              {project.description}
                            </span>
                          }
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.tech.map(t => (
                            <span key={t} className="text-[9px] px-2 py-0.5 rounded font-bold"
                              style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: 'rgba(0,229,255,0.7)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px]" style={{ color: 'rgba(0,255,157,0.3)' }}>
                    {isSelected ? '▲ COLLAPSE' : '▼ EXPAND DOSSIER'}
                  </span>
                  {isDecrypted && project.url && project.url !== '#' && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-[9px] font-bold px-3 py-1 rounded-lg"
                      style={{ background: 'rgba(0,255,157,0.15)', border: '1px solid rgba(0,255,157,0.4)', color: '#00ff9d' }}
                    >
                      LAUNCH <ExternalLink size={9} />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};