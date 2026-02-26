import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState, AppConfig } from '../types';
import { STATUS_COLORS, UI_TOKENS } from '../constants';
import { AnimatePresence, motion, useReducedMotion } from 'https://esm.sh/framer-motion@11.11.17';

interface WindowProps {
  config: AppConfig;
  state: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  children: ReactNode;
  onMouseDown: (e: React.MouseEvent, id: string, type: 'move' | 'resize') => void;
}

export const Window: React.FC<WindowProps> = ({
  config,
  state,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  children,
  onMouseDown,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {state.isOpen && !state.isMinimized && (
        <motion.div
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97, y: prefersReducedMotion ? 0 : 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, y: prefersReducedMotion ? 0 : 18 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.24, ease: 'easeOut' }}
          className={`absolute flex flex-col ${UI_TOKENS.glass.depthHigh} border overflow-hidden max-w-[100vw] max-h-[100vh] transition-all duration-300 ${
            isActive
              ? `${STATUS_COLORS.active.border} shadow-[0_0_35px_rgba(16,185,129,0.28)]`
              : 'border-green-900/50 opacity-90 blur-[0.2px]'
          }`}
          style={{
            left: state.x,
            top: state.y,
            width: state.width,
            height: state.height,
            zIndex: state.zIndex,
          }}
          onMouseDown={() => onFocus(config.id)}
        >
          <motion.div
            animate={{
              backgroundColor: isActive ? 'rgba(17, 65, 41, 0.5)' : 'rgba(0, 0, 0, 0.8)',
              boxShadow: isActive ? 'inset 0 -1px 0 rgba(16,185,129,0.45)' : 'inset 0 -1px 0 rgba(21, 128, 61, 0.2)'
            }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
            className="h-9 flex items-center justify-between px-3 border-b border-green-500/30 select-none cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => onMouseDown(e, config.id, 'move')}
          >
            <div className="flex items-center gap-2">
              <config.icon size={14} className="text-green-400" />
              <span className="text-xs font-bold tracking-[0.18em] text-green-200 uppercase">
                {config.title}
              </span>
            </div>
            <div className="flex gap-1">
              <motion.button
                whileTap={prefersReducedMotion ? {} : { scale: 0.9, y: 1 }}
                onClick={(e) => { e.stopPropagation(); onMinimize(config.id); }}
                className="p-1 hover:bg-green-500/20 text-green-400 rounded"
                aria-label="Minimize window"
              >
                <Minus size={12} />
              </motion.button>
              <motion.button
                whileTap={prefersReducedMotion ? {} : { scale: 0.9, y: 1 }}
                className={`p-1 rounded opacity-65 cursor-not-allowed ${STATUS_COLORS.warning.bg} ${STATUS_COLORS.warning.text}`}
                aria-label="Window maximize unavailable"
              >
                <Square size={12} />
              </motion.button>
              <motion.button
                whileTap={prefersReducedMotion ? {} : { scale: 0.9, y: 1 }}
                onClick={(e) => { e.stopPropagation(); onClose(config.id); }}
                className={`p-1 rounded ${STATUS_COLORS.locked.bg} ${STATUS_COLORS.locked.text}`}
                aria-label="Close window"
              >
                <X size={12} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: isActive ? 1 : 0.8, filter: isActive ? 'blur(0px)' : 'blur(0.4px)' }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.22 }}
            className="flex-1 overflow-auto p-4 relative custom-scrollbar"
          >
            {children}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500 pointer-events-none" />
          </motion.div>

          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 hover:bg-green-500/50"
            onMouseDown={(e) => onMouseDown(e, config.id, 'resize')}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-green-500" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
