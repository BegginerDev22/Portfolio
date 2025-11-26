import React, { ReactNode } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState, AppConfig } from '../types';

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
  if (!state.isOpen || state.isMinimized) return null;

  return (
    <div
      className={`absolute flex flex-col bg-black/90 border border-green-500/50 shadow-[0_0_20px_rgba(0,255,0,0.1)] backdrop-blur-sm overflow-hidden transition-opacity duration-200 max-w-[100vw] max-h-[100vh] ${
        isActive ? 'z-50 border-green-400 shadow-[0_0_30px_rgba(0,255,0,0.2)]' : 'z-0 opacity-90'
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
      {/* Title Bar */}
      <div
        className={`h-8 flex items-center justify-between px-2 border-b border-green-500/30 select-none cursor-grab active:cursor-grabbing ${
          isActive ? 'bg-green-900/20' : 'bg-black'
        }`}
        onMouseDown={(e) => onMouseDown(e, config.id, 'move')}
      >
        <div className="flex items-center gap-2">
          <config.icon size={14} className="text-green-500" />
          <span className="text-xs font-bold tracking-widest text-green-400 uppercase">
            {config.title}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(config.id); }}
            className="p-1 hover:bg-green-500/20 text-green-500 rounded"
          >
            <Minus size={12} />
          </button>
          <button className="p-1 hover:bg-green-500/20 text-green-500 rounded opacity-50 cursor-not-allowed">
            <Square size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(config.id); }}
            className="p-1 hover:bg-red-500/20 text-red-500 rounded"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 relative custom-scrollbar">
        {children}
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500 pointer-events-none" />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 hover:bg-green-500/50"
        onMouseDown={(e) => onMouseDown(e, config.id, 'resize')}
      >
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-green-500" />
      </div>
    </div>
  );
};