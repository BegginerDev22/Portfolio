import React from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export const Window = ({
  config,
  state,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  children,
  onMouseDown,
  isCompactLayout,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {state.isOpen && !state.isMinimized && (
        <motion.div
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.92,
            y: prefersReducedMotion ? 0 : 30,
          }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.94,
            y: prefersReducedMotion ? 0 : 20,
          }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="absolute flex flex-col overflow-hidden max-w-[100vw] max-h-[100vh]"
          style={{
            left: state.x,
            top: state.y,
            width: state.width,
            height: state.height,
            zIndex: state.zIndex,
            borderRadius: isCompactLayout ? '12px' : '10px',
            background: 'rgba(2, 8, 4, 0.88)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: isActive
              ? '1px solid rgba(0,255,157,0.55)'
              : '1px solid rgba(0,255,157,0.15)',
            boxShadow: isActive
              ? '0 0 0 1px rgba(0,255,157,0.15), 0 8px 48px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,157,0.12), inset 0 0 60px rgba(0,255,157,0.03)'
              : '0 4px 32px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,255,157,0.01)',
            transition: 'border-color 0.25s, box-shadow 0.25s',
          }}
          onMouseDown={() => onFocus(config.id)}
        >
          {/* ── Title bar ── */}
          <motion.div
            className={`h-10 flex items-center justify-between px-3 shrink-0 ${isCompactLayout ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
              }`}
            style={{
              background: isActive
                ? 'linear-gradient(90deg, rgba(0,77,48,0.5), rgba(0,0,0,0.4))'
                : 'rgba(0,0,0,0.6)',
              borderBottom: '1px solid rgba(0,255,157,0.12)',
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              if (isCompactLayout) return;
              onMouseDown(e, config.id, 'move');
            }}
          >
            {/* Left: icon + title */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Active dot */}
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: isActive ? '#00ff9d' : 'rgba(0,255,157,0.3)',
                  boxShadow: isActive ? '0 0 6px #00ff9d' : 'none',
                }}
              />
              <config.icon
                size={13}
                strokeWidth={1.6}
                style={{ color: isActive ? '#00ff9d' : 'rgba(0,255,157,0.5)', flexShrink: 0 }}
              />
              <span
                className="font-mono text-xs font-semibold tracking-[0.15em] uppercase truncate"
                style={{ color: isActive ? '#e0ffe8' : 'rgba(0,255,157,0.5)' }}
              >
                {config.title}
              </span>
            </div>

            {/* Right: window controls */}
            <div className="flex items-center gap-1 shrink-0" onMouseDown={e => e.stopPropagation()}>
              {/* Minimize */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onMinimize(config.id); }}
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150"
                style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.4)' }}
                aria-label="Minimize"
              >
                <Minus size={9} style={{ color: '#ffc107' }} />
              </motion.button>

              {/* Maximize (disabled) */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                className="w-5 h-5 rounded-full flex items-center justify-center opacity-40 cursor-not-allowed"
                style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)' }}
                aria-label="Maximize (unavailable)"
              >
                <Maximize2 size={8} style={{ color: '#00e5ff' }} />
              </motion.button>

              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.15, background: 'rgba(255,69,96,0.35)' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onClose(config.id); }}
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150"
                style={{ background: 'rgba(255,69,96,0.15)', border: '1px solid rgba(255,69,96,0.4)' }}
                aria-label="Close"
              >
                <X size={9} style={{ color: '#ff4560' }} />
              </motion.button>
            </div>
          </motion.div>

          {/* ── Content area ── */}
          <div
            className="flex-1 overflow-auto relative"
            style={{
              padding: '16px',
              opacity: isActive ? 1 : 0.82,
              transition: 'opacity 0.2s',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,77,48,0.6) transparent',
            }}
          >
            {children}

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
              style={{ borderTop: '1px solid rgba(0,255,157,0.3)', borderLeft: '1px solid rgba(0,255,157,0.3)' }} />
            <div className="absolute top-0 right-0 w-3 h-3 pointer-events-none"
              style={{ borderTop: '1px solid rgba(0,255,157,0.3)', borderRight: '1px solid rgba(0,255,157,0.3)' }} />
            <div className="absolute bottom-0 left-0 w-3 h-3 pointer-events-none"
              style={{ borderBottom: '1px solid rgba(0,255,157,0.3)', borderLeft: '1px solid rgba(0,255,157,0.3)' }} />
            <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
              style={{ borderBottom: '1px solid rgba(0,255,157,0.3)', borderRight: '1px solid rgba(0,255,157,0.3)' }} />
          </div>

          {/* ── Resize handle ── */}
          {!isCompactLayout && (
            <div
              className="absolute bottom-0 right-0 w-5 h-5 z-50 group"
              style={{ cursor: 'se-resize' }}
              onMouseDown={(e) => onMouseDown(e, config.id, 'resize')}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1 right-1">
                <line x1="2" y1="10" x2="10" y2="2" stroke="rgba(0,255,157,0.4)" strokeWidth="1" />
                <line x1="5" y1="10" x2="10" y2="5" stroke="rgba(0,255,157,0.3)" strokeWidth="1" />
                <line x1="8" y1="10" x2="10" y2="8" stroke="rgba(0,255,157,0.2)" strokeWidth="1" />
              </svg>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
