import React, { useState } from 'react';
import { PROJECTS } from '../../constants';
import { Lock, Unlock, ShieldAlert, ExternalLink } from 'lucide-react';

export const ProjectsApp: React.FC = () => {
  const [projects, setProjects] = useState(PROJECTS);
  const [decrypting, setDecrypting] = useState<string | null>(null);

  const handleDecrypt = (id: string) => {
    setDecrypting(id);
    
    // Simulation of decryption process
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'DECRYPTED' } : p))
      );
      setDecrypting(null);
    }, 1500);
  };

  return (
    <div className="text-green-400 space-y-6">
      <div className="border-b border-green-500/30 pb-2 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tighter">MISSION_FILES</h2>
          <p className="text-xs opacity-70">CLEARANCE LEVEL: TOP SECRET</p>
        </div>
        <ShieldAlert className="text-green-600 animate-pulse" />
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-green-900 bg-green-900/10 p-4 relative overflow-hidden group hover:border-green-500/50 transition-colors"
          >
            {decrypting === project.id && (
              <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-green-500 font-mono text-sm animate-pulse">DECRYPTING...</div>
                  <div className="text-xs text-green-700">
                    {Array(20).fill(0).map((_, i) => String.fromCharCode(Math.random() * 50 + 60)).join('')}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs text-green-600 font-mono block mb-1">CODENAME:</span>
                <h3 className="text-lg font-bold tracking-widest text-white/90">
                  {project.codename}
                </h3>
              </div>
              {project.status === 'CLASSIFIED' ? (
                <button
                  onClick={() => handleDecrypt(project.id)}
                  className="flex items-center gap-1 text-xs bg-red-900/30 text-red-400 px-2 py-1 border border-red-900 hover:bg-red-900/50 transition-colors uppercase"
                >
                  <Lock size={10} /> Encrypted
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-green-900/30 text-green-400 px-2 py-1 border border-green-900 uppercase">
                  <Unlock size={10} /> Decrypted
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-green-700 mr-2">CLIENT:</span>
                {project.status === 'CLASSIFIED' ? (
                  <span className="bg-green-900/50 text-transparent select-none px-1">REDACTED</span>
                ) : (
                  <span className="text-green-300">{project.client}</span>
                )}
              </div>
              
              <div className="text-sm leading-relaxed min-h-[3rem]">
                 <span className="text-green-700 mr-2">BRIEF:</span>
                {project.status === 'CLASSIFIED' ? (
                  <span className="bg-green-900/50 text-transparent select-none break-all">
                    XXX XX XXXXX XXXX XXXXXX XX XXXXX XXXX XXXXX XXX XXXX XX XXXXX
                  </span>
                ) : (
                  <span className="text-green-300 animate-in fade-in duration-500">{project.description}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-green-900/50 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs font-mono text-green-600 border border-green-900 px-1">
                      {t}
                    </span>
                  ))}
                </div>
                
                {project.status === 'DECRYPTED' && project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold bg-green-500 text-black px-3 py-1 hover:bg-white transition-colors animate-in zoom-in duration-300"
                  >
                    LAUNCH SYSTEM <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};