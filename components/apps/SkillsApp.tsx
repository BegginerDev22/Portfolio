import React, { useEffect, useState } from 'react';
import { SKILLS } from '../../constants';

export const SkillsApp: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-green-400">
       <div className="border-b border-green-500/30 pb-2 mb-6">
          <h2 className="text-xl font-bold tracking-tighter">OPERATIVE_CAPABILITIES</h2>
          <p className="text-xs opacity-70">PROFICIENCY ANALYSIS</p>
        </div>

        <div className="space-y-8">
          {SKILLS.map((category, catIndex) => (
            <div key={category.name}>
              <h3 className="text-sm font-bold text-green-600 mb-4 uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 bg-green-600 mr-2"></span>
                {category.name}
              </h3>
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => {
                  const delay = (catIndex * 3 + skillIndex) * 150;
                  
                  return (
                    <div key={skill.name} className="group">
                      <div className="flex justify-between text-xs mb-1 group-hover:text-white transition-colors">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-green-900/30 border border-green-900 relative overflow-hidden">
                        <div 
                          className="h-full bg-green-600/80 ease-out group-hover:bg-green-500 relative transition-all duration-1000 overflow-hidden"
                          style={{ 
                            width: mounted ? `${skill.level}%` : '0%',
                            transitionDelay: `${delay}ms`
                          }}
                        >
                          {/* Leading Edge Highlight */}
                          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-green-300 shadow-[0_0_8px_rgba(74,222,128,0.8)] z-10"></div>
                          
                          {/* Internal Scan Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/30 to-transparent w-full -translate-x-full animate-[scan_2s_linear_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};