import React, { useMemo, useState } from 'react';
import { Send, Radio, CheckCircle, Github, Mail, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Stable random values
const BARS = Array.from({ length: 36 }, (_, i) => ({
  dur: 0.2 + ((i * 7) % 5) * 0.1,
  delay: ((i * 13) % 10) * 0.05,
}));

export const ContactApp = () => {
  const [formState, setFormState] = useState('idle'); // idle | transmitting | sent
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState !== 'idle') return;
    setFormState('transmitting');
    setTimeout(() => {
      setFormState('sent');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormState('idle'), 3500);
    }, 2000);
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(0,255,157,0.18)',
    color: '#00ff9d',
    caretColor: '#00ff9d',
    borderRadius: '8px',
    padding: '10px 12px',
    width: '100%',
    fontSize: '12px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const inputFocusStyle = {
    borderColor: 'rgba(0,255,157,0.5)',
    boxShadow: '0 0 12px rgba(0,255,157,0.08)',
  };

  return (
    <div className="font-mono h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,255,157,0.15)' }}>
        <div>
          <h2 className="text-lg font-bold tracking-widest text-white">ENCRYPTED_CHANNEL</h2>
          <p className="text-[10px]" style={{ color: 'rgba(0,255,157,0.4)' }}>SECURE TRANSMISSION NODE // QUANTUM_ENCRYPTED</p>
        </div>
        <motion.div
          animate={formState === 'transmitting' ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: formState === 'transmitting' ? Infinity : 0, ease: 'linear' }}
        >
          <Radio size={18} style={{ color: 'rgba(0,255,157,0.6)' }} />
        </motion.div>
      </div>

      {/* Social links */}
      <div className="flex gap-2">
        {[
          { label: 'GitHub', icon: Github, href: 'https://github.com/' },
          { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/' },
          { label: 'Email', icon: Mail, href: 'mailto:sarthakmayani22@gmail.com' },
        ].map(({ label, icon: Icon, href }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold flex-1 justify-center"
            style={{ background: 'rgba(0,77,48,0.2)', border: '1px solid rgba(0,255,157,0.2)', color: 'rgba(0,255,157,0.7)' }}
          >
            <Icon size={11} /> {label}
          </motion.a>
        ))}
      </div>

      {/* Signal bars */}
      <div
        className="h-7 rounded-lg overflow-hidden flex items-end justify-center gap-[2px] px-2"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,77,48,0.3)' }}
      >
        {BARS.map((bar, i) => (
          <div
            key={i}
            className="w-1 rounded-sm sound-bar"
            style={{
              background: '#00ff9d',
              animationDuration: `${bar.dur}s`,
              animationDelay: `${bar.delay}s`,
              opacity: formState === 'transmitting' ? 0.9 : 0.4,
              height: formState === 'transmitting' ? '80%' : '20%',
              transition: 'height 0.3s, opacity 0.3s',
            }}
          />
        ))}
      </div>

      {/* Form / Success */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {formState === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,255,157,0.1)', border: '2px solid rgba(0,255,157,0.5)', boxShadow: '0 0 30px rgba(0,255,157,0.2)' }}
              >
                <CheckCircle size={32} style={{ color: '#00ff9d' }} />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-white mb-1">TRANSMISSION SUCCESSFUL</h3>
                <p className="text-[10px]" style={{ color: 'rgba(0,255,157,0.5)' }}>PAYLOAD DELIVERED. TRACE REMOVED.</p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 h-full"
            >
              {[
                { key: 'name', type: 'text', label: 'AGENT_ID (Name)', placeholder: 'IDENTIFY YOURSELF' },
                { key: 'email', type: 'email', label: 'FREQUENCY (Email)', placeholder: 'SECURE RETURN CHANNEL' },
              ].map(field => (
                <div key={field.key} className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest" style={{ color: 'rgba(0,255,157,0.45)' }}>
                    {field.label}
                  </label>
                  <input
                    required
                    type={field.type}
                    value={formData[field.key]}
                    onChange={e => setFormData(d => ({ ...d, [field.key]: e.target.value }))}
                    style={inputStyle}
                    placeholder={field.placeholder}
                    disabled={formState === 'transmitting'}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,157,0.18)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              ))}

              <div className="space-y-1 flex-1 flex flex-col">
                <label className="text-[9px] font-bold tracking-widest" style={{ color: 'rgba(0,255,157,0.45)' }}>
                  PAYLOAD (Message)
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                  style={{ ...inputStyle, flex: 1, resize: 'none', minHeight: '80px' }}
                  placeholder="ENTER ENCRYPTED MESSAGE..."
                  disabled={formState === 'transmitting'}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,255,157,0.18)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={formState === 'transmitting'}
                whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-3 rounded-xl text-xs font-bold tracking-widest uppercase overflow-hidden"
                style={{
                  background: formState === 'transmitting' ? 'rgba(0,77,48,0.3)' : 'rgba(0,255,157,0.12)',
                  border: '1px solid rgba(0,255,157,0.4)',
                  color: '#00ff9d',
                  cursor: formState === 'transmitting' ? 'wait' : 'pointer',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {formState === 'transmitting' ? (
                    <>
                      <Radio size={14} className="animate-spin" /> ENCRYPTING & TRANSMITTING...
                    </>
                  ) : (
                    <>
                      TRANSMIT PAYLOAD <Send size={13} />
                    </>
                  )}
                </span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(0,255,157,0.08) 50%, transparent 70%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                />
              </motion.button>

              {/* Footer */}
              <div className="flex items-center justify-between text-[9px]" style={{ color: 'rgba(0,255,157,0.25)' }}>
                <span>UNSECURE LINES MONITORED</span>
                <span>SIGNAL: <span style={{ color: '#00ff9d' }}>STRONG</span></span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};