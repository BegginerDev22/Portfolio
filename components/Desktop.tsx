import React, { useState, useEffect } from 'react';
import { APPS } from '../constants';
import { WindowState, AppId } from '../types';
import { Window } from './Window';
import { ProjectsApp } from './apps/ProjectsApp';
import { ProfileApp } from './apps/ProfileApp';
import { SkillsApp } from './apps/SkillsApp';
import { TerminalApp } from './apps/TerminalApp';
import { ResumeLock } from './apps/ResumeLock';
import { ContactApp } from './apps/ContactApp';
import { SystemMonitor } from './SystemMonitor';

export const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<Record<string, WindowState>>(() => {
    // Initialize windows from APPS config with responsive check
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const initial: Record<string, WindowState> = {};
    
    APPS.forEach(app => {
      initial[app.id] = {
        id: app.id,
        isOpen: false,
        isMinimized: false,
        zIndex: 1,
        // Mobile: centered with margins; Desktop: config defaults
        x: isMobile ? 10 : app.defaultX,
        y: isMobile ? 60 : app.defaultY,
        width: isMobile ? window.innerWidth - 20 : app.defaultWidth,
        height: isMobile ? Math.min(600, window.innerHeight - 120) : app.defaultHeight
      };
    });
    return initial;
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    id: string;
    type: 'move' | 'resize';
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
  } | null>(null);

  // Handle window resize events (orientation change)
  useEffect(() => {
    const handleResize = () => {
      setWindows((prev) => {
        const next = { ...prev };
        const isMobile = window.innerWidth < 768;
        let hasChanges = false;

        Object.keys(next).forEach((key) => {
          const win = next[key];
          
          // Clamp width if it exceeds viewport
          if (win.width > window.innerWidth) {
            next[key] = {
              ...win,
              width: window.innerWidth - 20,
              x: 10,
            };
            hasChanges = true;
          }
          
          // Ensure window is on screen
          if (win.x + win.width > window.innerWidth) {
             next[key] = {
               ...next[key],
               x: Math.max(0, window.innerWidth - next[key].width - 10)
             };
             hasChanges = true;
          }
        });

        return hasChanges ? next : prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bringToFront = (id: string) => {
    setActiveId(id);
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map((w: WindowState) => w.zIndex), 0);
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: maxZ + 1, isMinimized: false }
      };
    });
  };

  const openApp = (id: AppId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false }
    }));
    bringToFront(id);
  };

  const closeApp = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  const minimizeApp = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
    setActiveId(null);
  };

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent, id: string, type: 'move' | 'resize') => {
    e.preventDefault();
    bringToFront(id);
    const win = windows[id];
    setDragState({
      id,
      type,
      startX: e.clientX,
      startY: e.clientY,
      initialX: win.x,
      initialY: win.y,
      initialWidth: win.width,
      initialHeight: win.height
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    setWindows(prev => {
      const win = prev[dragState.id];
      if (dragState.type === 'move') {
        return {
          ...prev,
          [dragState.id]: { ...win, x: dragState.initialX + dx, y: dragState.initialY + dy }
        };
      } else {
        return {
          ...prev,
          [dragState.id]: { 
            ...win, 
            width: Math.max(300, dragState.initialWidth + dx), 
            height: Math.max(200, dragState.initialHeight + dy) 
          }
        };
      }
    });
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  const renderAppContent = (id: AppId) => {
    switch (id) {
      case 'projects': return <ProjectsApp />;
      case 'profile': return <ProfileApp />;
      case 'skills': return <SkillsApp />;
      case 'terminal': return <TerminalApp />;
      case 'resume': return <ResumeLock />;
      case 'contact': return <ContactApp />;
      default: return null;
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-black relative overflow-hidden scanlines selection:bg-green-500 selection:text-black"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Grid Animation */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(25,1fr)] pointer-events-none opacity-10">
        {Array(1000).fill(0).map((_, i) => (
            <div key={i} className="border-[0.5px] border-green-900/30"></div>
        ))}
      </div>

      {/* System Monitor Widget (Fixed Background Element) */}
      <SystemMonitor />

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-10">
        {APPS.map(app => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="group flex flex-col items-center gap-2 w-24 p-2 hover:bg-green-500/10 rounded transition-colors"
          >
            <div className="relative text-green-500 group-hover:text-green-300 transition-colors">
               <app.icon size={48} strokeWidth={1.5} />
               <div className="absolute inset-0 bg-green-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="text-xs font-mono text-green-500 bg-black/50 px-2 py-0.5 rounded shadow-lg group-hover:text-white">
              {app.title}
            </span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {APPS.map(app => (
        <Window
          key={app.id}
          config={app}
          state={windows[app.id]}
          isActive={activeId === app.id}
          onClose={closeApp}
          onMinimize={minimizeApp}
          onFocus={bringToFront}
          onMouseDown={handleMouseDown}
        >
          {renderAppContent(app.id)}
        </Window>
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black border-t border-green-900 flex items-center px-4 gap-2 z-[100]">
        <div className="mr-4 bg-green-900/30 px-2 py-1 rounded border border-green-800">
            <span className="font-bold text-green-500 text-sm tracking-widest">SpyOS</span>
        </div>
        <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
          {APPS.map(app => {
             const isOpen = windows[app.id].isOpen;
             const isActive = activeId === app.id;
             if (!isOpen) return null;
             
             return (
               <button
                 key={app.id}
                 onClick={() => isOpen && isActive ? minimizeApp(app.id) : openApp(app.id)}
                 className={`h-8 px-3 flex items-center gap-2 border text-xs rounded transition-all whitespace-nowrap ${
                   isActive 
                     ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_10px_rgba(0,255,0,0.2)]' 
                     : 'bg-black border-green-900 text-green-700 hover:bg-green-900/20 hover:text-green-500'
                 }`}
               >
                 <app.icon size={14} />
                 <span className="hidden md:inline">{app.title}</span>
               </button>
             );
          })}
        </div>
        <div className="ml-auto text-xs text-green-800 font-mono hidden md:block">
           SECURE CONNECTION // {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};