import React, { useState, useEffect } from 'react';
import { APPS, UI_TOKENS, STATUS_COLORS } from '../constants';
import { Window } from './Window';
import { ProjectsApp } from './apps/ProjectsApp';
import { ProfileApp } from './apps/ProfileApp';
import { SkillsApp } from './apps/SkillsApp';
import { TerminalApp } from './apps/TerminalApp';
import { ResumeLock } from './apps/ResumeLock';
import { ContactApp } from './apps/ContactApp';
import { SystemMonitor } from './SystemMonitor';
import { AnimatePresence, motion, useReducedMotion } from 'https://esm.sh/framer-motion@11.11.17';

export const Desktop = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isCompactLayout, setIsCompactLayout] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [windows, setWindows] = useState(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const initial = {};

    APPS.forEach(app => {
      initial[app.id] = {
        id: app.id,
        isOpen: false,
        isMinimized: false,
        zIndex: 1,
        x: isMobile ? 10 : app.defaultX,
        y: isMobile ? 60 : app.defaultY,
        width: isMobile ? window.innerWidth - 20 : app.defaultWidth,
        height: isMobile ? Math.min(600, window.innerHeight - 120) : app.defaultHeight
      };
    });

    return initial;
  });

  const [activeId, setActiveId] = useState(null);
  const [dragState, setDragState] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1024;
      setIsCompactLayout(compact);

      setWindows((prev) => {
        const next = { ...prev };
        let hasChanges = false;

        Object.keys(next).forEach((key) => {
          const win = next[key];
          const mobileWidth = window.innerWidth - 16;
          const mobileHeight = window.innerHeight - 112;

          if (compact) {
            const mobileX = 8;
            const mobileY = 52;
            if (
              win.width !== mobileWidth ||
              win.height !== mobileHeight ||
              win.x !== mobileX ||
              win.y !== mobileY
            ) {
              next[key] = {
                ...win,
                width: mobileWidth,
                height: mobileHeight,
                x: mobileX,
                y: mobileY,
              };
              hasChanges = true;
            }
            return;
          }

          if (win.width > window.innerWidth) {
            next[key] = {
              ...win,
              width: window.innerWidth - 20,
              x: 10,
            };
            hasChanges = true;
          }

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

  const bringToFront = (id) => {
    setActiveId(id);
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map((w) => w.zIndex), 0);
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: maxZ + 1, isMinimized: false }
      };
    });
  };

  const openApp = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false }
    }));
    bringToFront(id);
  };

  const closeApp = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  const minimizeApp = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
    setActiveId(null);
  };

  const handleMouseDown = (e, id, type) => {
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

  const handleMouseMove = (e) => {
    if (!dragState || isCompactLayout) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    setWindows(prev => {
      const win = prev[dragState.id];
      if (dragState.type === 'move') {
        const nextX = Math.min(
          Math.max(0, dragState.initialX + dx),
          Math.max(0, window.innerWidth - win.width)
        );
        const nextY = Math.min(
          Math.max(0, dragState.initialY + dy),
          Math.max(0, window.innerHeight - win.height - 48)
        );

        return {
          ...prev,
          [dragState.id]: { ...win, x: nextX, y: nextY }
        };
      }

      return {
        ...prev,
        [dragState.id]: {
          ...win,
          width: Math.max(300, Math.min(window.innerWidth - 12, dragState.initialWidth + dx)),
          height: Math.max(200, Math.min(window.innerHeight - 56, dragState.initialHeight + dy))
        }
      };
    });
  };

  const handleMouseUp = () => setDragState(null);

  const renderAppContent = (id) => {
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

  const iconVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18, scale: prefersReducedMotion ? 1 : 0.98 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: prefersReducedMotion ? 0 : 0.08 * index,
        duration: prefersReducedMotion ? 0.15 : 0.34,
        ease: 'easeOut',
      }
    })
  };

  return (
    <div
      className={`h-screen w-screen ${UI_TOKENS.desktopTexture} bg-black relative overflow-hidden scanlines selection:bg-green-500 selection:text-black`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(25,1fr)] pointer-events-none opacity-10">
        {Array(1000).fill(0).map((_, i) => (
          <div key={i} className="border-[0.5px] border-green-900/30" />
        ))}
      </div>

      <SystemMonitor />

      <motion.div className={`absolute z-10 ${isCompactLayout ? 'top-2 left-2 right-2 flex flex-row gap-2 overflow-x-auto no-scrollbar pb-1' : 'top-4 left-4 flex flex-col gap-5'}`} initial="hidden" animate="visible">
        {APPS.map((app, index) => (
          <motion.button
            key={app.id}
            custom={index}
            variants={iconVariants}
            whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.04 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            onClick={() => openApp(app.id)}
            className={`group flex ${isCompactLayout ? 'flex-row items-center min-w-[156px] justify-start gap-3' : 'flex-col items-center gap-2 w-24'} ${UI_TOKENS.spacing.iconPadding} rounded-xl ${UI_TOKENS.glass.depthLow} border border-green-900/30 hover:border-green-500/40`}
          >
            <div className="relative text-green-500 group-hover:text-green-200 transition-colors">
              <app.icon size={48} strokeWidth={1.5} />
              <motion.div
                className={`absolute inset-0 ${STATUS_COLORS.active.glow} blur-xl opacity-0 group-hover:opacity-60`}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-xs font-mono text-green-300 bg-black/60 px-2 py-0.5 rounded shadow-lg tracking-wide group-hover:text-white whitespace-nowrap">
              {app.title}
            </span>
          </motion.button>
        ))}
      </motion.div>

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
          isCompactLayout={isCompactLayout}
        >
          {renderAppContent(app.id)}
        </Window>
      ))}

      <motion.div
        className={`absolute bottom-0 left-0 right-0 ${isCompactLayout ? 'h-14 px-2' : 'h-12 px-4'} ${UI_TOKENS.glass.depthMid} border-t border-green-900/70 flex items-center gap-2 z-[100]`}
        initial={{ y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease: 'easeOut' }}
      >
        <div className={`${isCompactLayout ? 'mr-1 px-1.5' : 'mr-4 px-2'} bg-green-900/30 py-1 rounded border border-green-700`}>
          <span className="font-bold text-green-400 text-sm tracking-[0.2em]">SpyOS</span>
        </div>
        <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {APPS.map(app => {
              const isOpen = windows[app.id].isOpen;
              const isTaskActive = activeId === app.id;
              if (!isOpen) return null;

              return (
                <motion.button
                  key={app.id}
                  layout
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 16, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, scale: 0.95 }}
                  transition={{ duration: prefersReducedMotion ? 0.12 : 0.25 }}
                  onClick={() => isTaskActive ? minimizeApp(app.id) : openApp(app.id)}
                  className={`h-8 px-3 flex items-center gap-2 border text-xs rounded whitespace-nowrap ${
                    isTaskActive
                      ? `${STATUS_COLORS.active.bg} ${STATUS_COLORS.active.border} text-green-200 shadow-[0_0_18px_rgba(16,185,129,0.35)]`
                      : `${UI_TOKENS.glass.depthLow} border-green-900 text-green-600 hover:bg-green-900/30 hover:text-green-400`
                  }`}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                >
                  <app.icon size={14} />
                  <span className="hidden sm:inline tracking-wide">{app.title}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="ml-auto text-xs text-green-700 font-mono hidden lg:block tracking-wider">
          SECURE CONNECTION // {new Date().toLocaleDateString()}
        </div>
      </motion.div>
    </div>
  );
};
