import React, { useState, useEffect, useRef } from 'react';
import { APPS } from '../constants';
import { Window } from './Window';
import { ProjectsApp } from './apps/ProjectsApp';
import { ProfileApp } from './apps/ProfileApp';
import { SkillsApp } from './apps/SkillsApp';
import { TerminalApp } from './apps/TerminalApp';
import { ResumeLock } from './apps/ResumeLock';
import { ContactApp } from './apps/ContactApp';
import { SystemMonitor } from './SystemMonitor';
import { ThreeBackground } from './ThreeBackground';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Clock, Shield, Wifi, ChevronRight } from 'lucide-react';

// ── Live clock ──
const useClock = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
};

export const Desktop = () => {
  const prefersReducedMotion = useReducedMotion();
  const time = useClock();
  const [isCompactLayout, setIsCompactLayout] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  // On mobile: icons are a slim left column, width ~64px
  const TASKBAR_H = 48;
  const ICON_COL_W = 64; // compact left icon column width
  const [windows, setWindows] = useState(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    const initial = {};
    APPS.forEach(app => {
      initial[app.id] = {
        id: app.id,
        isOpen: false,
        isMinimized: false,
        zIndex: 1,
        x: isMobile ? ICON_COL_W + 6 : app.defaultX,
        y: isMobile ? 6 : app.defaultY,
        width: isMobile ? window.innerWidth - ICON_COL_W - 12 : app.defaultWidth,
        height: isMobile ? Math.min(window.innerHeight - TASKBAR_H - 16, 600) : app.defaultHeight,
      };
    });
    return initial;
  });

  const [activeId, setActiveId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [hoveredApp, setHoveredApp] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1024;
      setIsCompactLayout(compact);
      setWindows((prev) => {
        const next = { ...prev };
        let hasChanges = false;
        Object.keys(next).forEach((key) => {
          const win = next[key];
          if (compact) {
            const mw = window.innerWidth - ICON_COL_W - 12;
            const mh = window.innerHeight - TASKBAR_H - 16;
            const mx = ICON_COL_W + 6;
            const my = 6;
            if (win.width !== mw || win.height !== mh || win.x !== mx || win.y !== my) {
              next[key] = { ...win, width: mw, height: mh, x: mx, y: my };
              hasChanges = true;
            }
            return;
          }
          if (win.width > window.innerWidth) {
            next[key] = { ...win, width: window.innerWidth - 20, x: 10 };
            hasChanges = true;
          }
          if (win.x + win.width > window.innerWidth) {
            next[key] = { ...next[key], x: Math.max(0, window.innerWidth - next[key].width - 10) };
            hasChanges = true;
          }
        });
        return hasChanges ? next : prev;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [TASKBAR_H, ICON_COL_W]);

  const bringToFront = (id) => {
    setActiveId(id);
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map((w) => w.zIndex), 0);
      return { ...prev, [id]: { ...prev[id], zIndex: maxZ + 1, isMinimized: false } };
    });
  };

  const openApp = (id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, isMinimized: false } }));
    bringToFront(id);
  };

  const closeApp = (id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }));
    if (activeId === id) setActiveId(null);
  };

  const minimizeApp = (id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));
    setActiveId(null);
  };

  const handleMouseDown = (e, id, type) => {
    e.preventDefault();
    bringToFront(id);
    const win = windows[id];
    setDragState({
      id, type,
      startX: e.clientX, startY: e.clientY,
      initialX: win.x, initialY: win.y,
      initialWidth: win.width, initialHeight: win.height,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState || isCompactLayout) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    setWindows(prev => {
      const win = prev[dragState.id];
      if (dragState.type === 'move') {
        return {
          ...prev,
          [dragState.id]: {
            ...win,
            x: Math.min(Math.max(0, dragState.initialX + dx), Math.max(0, window.innerWidth - win.width)),
            y: Math.min(Math.max(0, dragState.initialY + dy), Math.max(0, window.innerHeight - win.height - 48)),
          },
        };
      }
      return {
        ...prev,
        [dragState.id]: {
          ...win,
          width: Math.max(320, Math.min(window.innerWidth - 12, dragState.initialWidth + dx)),
          height: Math.max(220, Math.min(window.innerHeight - 56, dragState.initialHeight + dy)),
        },
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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24, scale: 0.92 },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: prefersReducedMotion ? 0 : 0.07 * i, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div
      className="h-screen w-screen relative overflow-hidden select-none scanlines vignette"
      style={{ cursor: dragState ? (dragState.type === 'resize' ? 'se-resize' : 'grabbing') : 'default' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── 3D Background ── */}
      <ThreeBackground />

      {/* ── Ambient overlays ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 10% 90%, rgba(0,255,157,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 90% 10%,  rgba(0,229,255,0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── System Monitor ── */}
      <div className="relative z-[5]">
        <SystemMonitor />
      </div>

      {/* ── Desktop Icons ── */}
      {/* Always a left-side vertical column — compact on mobile, wider on desktop */}
      <motion.div
        className={`absolute z-10 left-2 flex flex-col gap-2 overflow-y-auto no-scrollbar py-1 ${isCompactLayout
            ? 'top-2 bottom-14' /* above taskbar on mobile */
            : 'top-4'           /* free-grows on desktop */
          }`}
        style={isCompactLayout ? { width: `${ICON_COL_W - 8}px` } : {}}
        initial="hidden"
        animate="visible"
      >
        {APPS.map((app, index) => (
          <motion.button
            key={app.id}
            custom={index}
            variants={iconVariants}
            whileHover={prefersReducedMotion ? {} : { scale: 1.06, y: -2 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            onClick={() => openApp(app.id)}
            onHoverStart={() => setHoveredApp(app.id)}
            onHoverEnd={() => setHoveredApp(null)}
            className={`group relative flex flex-col items-center gap-1 rounded-xl border transition-all duration-200 ${isCompactLayout
              ? 'w-full py-2 px-1'
              : 'w-[76px] py-3 px-2 gap-1.5'
              }`}
            style={{
              background: hoveredApp === app.id
                ? 'rgba(0,255,157,0.08)'
                : 'rgba(0,0,0,0.5)',
              border: hoveredApp === app.id
                ? '1px solid rgba(0,255,157,0.45)'
                : '1px solid rgba(0,255,157,0.12)',
              backdropFilter: 'blur(10px)',
              boxShadow: hoveredApp === app.id
                ? '0 0 24px rgba(0,255,157,0.15), inset 0 0 12px rgba(0,255,157,0.05)'
                : 'none',
            }}
          >
            {/* Icon */}
            <div className="relative">
              <app.icon
                size={isCompactLayout ? 20 : 32}
                strokeWidth={1.4}
                style={{ color: hoveredApp === app.id ? '#00ff9d' : '#00b36b' }}
                className="transition-colors duration-200"
              />
              {/* Glow blob */}
              {hoveredApp === app.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 blur-xl rounded-full pointer-events-none"
                  style={{ background: 'rgba(0,255,157,0.4)' }}
                />
              )}
            </div>

            {/* Label */}
            <span
              className="font-mono transition-colors duration-200 leading-tight text-center w-full"
              style={{
                fontSize: isCompactLayout ? '7px' : '9px',
                color: hoveredApp === app.id ? '#ffffff' : 'rgba(0,255,157,0.7)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {app.title}
            </span>

            {/* Open indicator */}
            {windows[app.id]?.isOpen && (
              <div
                className="absolute bottom-0.5 w-1 h-1 rounded-full"
                style={{
                  background: '#00ff9d',
                  boxShadow: '0 0 4px #00ff9d',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* ── Windows ── */}
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

      {/* ── Taskbar ── */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 z-[100] flex items-center gap-2 ${isCompactLayout ? 'h-12 px-2' : 'h-12 px-4'
          }`}
        style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(0,255,157,0.2)',
          boxShadow: '0 -4px 30px rgba(0,255,157,0.06)',
        }}
        initial={{ y: prefersReducedMotion ? 0 : 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo / branding */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-lg shrink-0"
          style={{
            background: 'rgba(0,255,157,0.08)',
            border: '1px solid rgba(0,255,157,0.25)',
          }}
        >
          <Shield size={14} style={{ color: '#00ff9d' }} />
          <span className="font-mono font-bold tracking-[0.2em] text-xs" style={{ color: '#00ff9d' }}>
            SpyOS
          </span>
        </div>

        <div className="h-4 w-px opacity-20" style={{ background: '#00ff9d' }} />

        {/* Open windows in taskbar */}
        <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {APPS.map(app => {
              const isOpen = windows[app.id]?.isOpen;
              const isTaskActive = activeId === app.id;
              if (!isOpen) return null;
              return (
                <motion.button
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, x: 12 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: -8 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => isTaskActive ? minimizeApp(app.id) : openApp(app.id)}
                  whileTap={{ scale: 0.95 }}
                  className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-xs whitespace-nowrap font-mono transition-all duration-200 border"
                  style={{
                    background: isTaskActive ? 'rgba(0,255,157,0.12)' : 'rgba(0,0,0,0.3)',
                    border: isTaskActive ? '1px solid rgba(0,255,157,0.5)' : '1px solid rgba(0,255,157,0.1)',
                    color: isTaskActive ? '#00ff9d' : 'rgba(0,255,157,0.5)',
                    boxShadow: isTaskActive ? '0 0 12px rgba(0,255,157,0.2)' : 'none',
                  }}
                >
                  <app.icon size={12} />
                  <span className="hidden sm:inline">{app.title}</span>
                  {windows[app.id]?.isMinimized && (
                    <span className="text-[8px] opacity-50">(MIN)</span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right side: clock + status */}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            <Wifi size={11} style={{ color: 'rgba(0,229,255,0.7)' }} />
            <span className="font-mono text-[9px]" style={{ color: 'rgba(0,229,255,0.5)' }}>
              SECURE
            </span>
          </div>
          <div className="hidden lg:flex flex-col items-end">
            <span className="font-mono text-xs font-semibold" style={{ color: '#00ff9d' }}>
              {formattedTime}
            </span>
            <span className="font-mono text-[9px] opacity-40">{formattedDate}</span>
          </div>
          <Clock size={13} className="hidden lg:block" style={{ color: 'rgba(0,255,157,0.4)' }} />
        </div>
      </motion.div>
    </div>
  );
};
