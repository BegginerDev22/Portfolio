import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'init', role: 'system', text: '[ SECURE UPLINK ESTABLISHED — AES-256-GCM — TLS 1.3 ]' },
    { id: 'intro', role: 'model', text: 'Agent, this is HQ. I am ready to assist with intelligence gathering or code analysis. What is your status?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!process.env.API_KEY) {
        throw new Error('UPLINK_CIPHER_MISSING: Secure configuration not found. Contact HQ.');
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, parts: [{ text: m.text }] }));

      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction:
            "You are a handler at an intelligence agency HQ. The user is a field agent (Spy). Answer questions about technology, coding, and mission strategy in a cryptic, professional, military-style tone. Keep responses concise and snappy. Use terms like 'Intel', 'Operative', 'Asset', 'Cipher', 'Mission'. Don't break character.",
        },
        history,
      });

      const result = await chat.sendMessageStream({ message: userText });
      let fullResponse = '';
      const msgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: msgId, role: 'model', text: '' }]);

      for await (const chunk of result) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: fullResponse } : m));
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        text: `ERROR: ${error?.message || 'UPLINK SEVERED. RETRY.'}`,
        error: true,
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const msgColor = {
    user: 'rgba(0,255,157,0.85)',
    model: 'rgba(0,229,255,0.85)',
    system: 'rgba(255,193,7,0.8)',
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs" style={{ minHeight: 0 }}>
      {/* Message log */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,77,48,0.5) transparent' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'system' ? (
                <div className="w-full text-center py-1"
                  style={{ color: msg.error ? 'rgba(255,69,96,0.8)' : 'rgba(255,193,7,0.6)', fontSize: '10px' }}>
                  ── {msg.text} ──
                </div>
              ) : (
                <div
                  className="max-w-[88%] rounded-xl px-3 py-2"
                  style={{
                    background: msg.role === 'user'
                      ? 'rgba(0,77,48,0.25)'
                      : 'rgba(0,30,40,0.4)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(0,255,157,0.25)' : 'rgba(0,229,255,0.2)'}`,
                  }}
                >
                  <div className="text-[9px] font-bold mb-1 tracking-widest opacity-50" style={{ color: msgColor[msg.role] }}>
                    {msg.role === 'user' ? 'FIELD_AGENT' : 'HQ_INTEL'}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed" style={{ color: msgColor[msg.role] }}>
                    {msg.text}
                    {msg.role === 'model' && msg.text === '' && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                      >█</motion.span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-3 py-2 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(0,30,40,0.4)', border: '1px solid rgba(0,229,255,0.15)' }}>
              <Loader2 size={11} className="animate-spin" style={{ color: '#00e5ff' }} />
              <span className="text-[10px]" style={{ color: 'rgba(0,229,255,0.6)' }}>PROCESSING INTEL...</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="mt-3 flex gap-2 items-center rounded-xl px-3 py-2"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(0,255,157,0.2)',
          boxShadow: 'inset 0 0 10px rgba(0,255,157,0.03)',
        }}
      >
        <span className="text-[11px] shrink-0 select-none" style={{ color: 'rgba(0,255,157,0.4)' }}>
          AGENT@HQ:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm"
          style={{ color: '#00ff9d', caretColor: '#00ff9d' }}
          placeholder="Enter command or query..."
          autoFocus
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="shrink-0 p-1.5 rounded-lg transition-all"
          style={{
            background: input.trim() ? 'rgba(0,255,157,0.15)' : 'transparent',
            color: input.trim() ? '#00ff9d' : 'rgba(0,255,157,0.25)',
          }}
        >
          <Send size={14} />
        </motion.button>
      </form>
    </div>
  );
};
