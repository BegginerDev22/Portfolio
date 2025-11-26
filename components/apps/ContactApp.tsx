import React, { useState } from 'react';
import { Send, Radio, AlertCircle, CheckCircle, Mic } from 'lucide-react';

export const ContactApp: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'transmitting' | 'sent'>('idle');
  const [formData, setFormData] = useState({
    agentId: '',
    frequency: '',
    payload: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState !== 'idle') return;

    setFormState('transmitting');
    
    // Simulate network transmission
    setTimeout(() => {
      setFormState('sent');
      setFormData({ agentId: '', frequency: '', payload: '' });
      
      setTimeout(() => {
        setFormState('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col text-green-400 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

      <div className="border-b border-green-500/30 pb-2 mb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold tracking-tighter">ENCRYPTED_CHANNEL</h2>
          <p className="text-xs opacity-70">SECURE TRANSMISSION NODE</p>
        </div>
        <Radio className={`text-green-600 ${formState === 'transmitting' ? 'animate-ping' : ''}`} />
      </div>

      {formState === 'sent' ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
           <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-500/10">
              <CheckCircle size={40} className="text-green-500" />
           </div>
           <div className="text-center">
             <h3 className="text-xl font-bold">TRANSMISSION SUCCESSFUL</h3>
             <p className="text-xs text-green-600 mt-2">PAYLOAD DELIVERED TO HQ.</p>
             <p className="text-xs text-green-800 mt-1">TRACE REMOVED.</p>
           </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-green-500"></span> AGENT_ID (Name)
            </label>
            <input 
              required
              type="text"
              value={formData.agentId}
              onChange={e => setFormData({...formData, agentId: e.target.value})}
              className="w-full bg-black/50 border border-green-900 p-2 text-sm text-green-300 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="IDENTIFY YOURSELF"
              disabled={formState === 'transmitting'}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-green-500"></span> FREQUENCY (Email)
            </label>
            <input 
              required
              type="email"
              value={formData.frequency}
              onChange={e => setFormData({...formData, frequency: e.target.value})}
              className="w-full bg-black/50 border border-green-900 p-2 text-sm text-green-300 focus:border-green-500 focus:outline-none transition-colors"
              placeholder="SECURE RETURN CHANNEL"
              disabled={formState === 'transmitting'}
            />
          </div>

          <div className="space-y-1 flex-1 flex flex-col">
            <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
               <span className="w-1 h-1 bg-green-500"></span> PAYLOAD (Message)
            </label>
            <textarea 
              required
              value={formData.payload}
              onChange={e => setFormData({...formData, payload: e.target.value})}
              className="flex-1 w-full bg-black/50 border border-green-900 p-2 text-sm text-green-300 focus:border-green-500 focus:outline-none transition-colors resize-none"
              placeholder="ENTER ENCRYPTED MESSAGE..."
              disabled={formState === 'transmitting'}
            />
          </div>

          {/* Audio Visualization / Signal Strength */}
          <div className="h-8 bg-black border border-green-900 flex items-end justify-center gap-[2px] p-1 overflow-hidden opacity-50">
             {Array(40).fill(0).map((_, i) => (
               <div 
                 key={i} 
                 className="w-1 bg-green-500 sound-bar"
                 style={{ 
                   animationDuration: `${Math.random() * 0.5 + 0.2}s`,
                   animationDelay: `${Math.random() * 0.5}s`,
                   height: formState === 'transmitting' ? '100%' : '10%'
                 }}
               />
             ))}
          </div>

          <button 
            type="submit"
            disabled={formState === 'transmitting'}
            className="group relative w-full bg-green-900/20 border border-green-700 py-3 text-sm font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-wait overflow-hidden"
          >
            {formState === 'transmitting' ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                <Radio size={16} className="animate-spin" /> ENCRYPTING & SENDING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                TRANSMIT PAYLOAD <Send size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
            
            {/* Hover Glitch Effect Line */}
            <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover:left-[200%] transition-all duration-500"></div>
          </button>
        </form>
      )}

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-green-800 font-mono">
         <div className="flex items-center gap-1">
           <AlertCircle size={10} />
           <span>UNSECURE LINES MONITORED</span>
         </div>
         <div>
           SIGNAL: <span className="text-green-500">STRONG</span>
         </div>
      </div>
    </div>
  );
};