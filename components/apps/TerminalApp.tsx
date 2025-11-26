import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Send } from 'lucide-react';

// NOTE: In a production environment, calls should go to a backend. 
// For this specific demo request, we access process.env.API_KEY directly 
// as instructed by the prompt rules for the demo.

interface Message {
  id: string;
  role: 'user' | 'system' | 'model';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'system', text: 'SECURE UPLINK ESTABLISHED. CONNECTED TO HQ AI.' },
    { id: 'intro', role: 'model', text: 'Agent, this is HQ. I am ready to assist with intelligence gathering or code analysis. What is your status?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Fallback if no key is present
      if (!process.env.API_KEY) {
        throw new Error("API_KEY_MISSING: Secure uplink configuration not found.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Format history for the chat
      const history = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role as 'user' | 'model',
                parts: [{ text: m.text }]
            }));

      const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a handler at an intelligence agency HQ. The user is a field agent (Spy). Answer questions about technology, coding, and mission strategy in a cryptic, professional, military-style tone. Keep responses concise. Use terms like 'Intel', 'Operative', 'Asset', 'Cipher'. Do not break character."
        },
        history: history
      });

      const result = await chat.sendMessageStream({ message: userMsg.text });
      
      let fullResponse = "";
      const msgId = (Date.now() + 1).toString();
      
      // Optimistically add empty message to stream into
      setMessages(prev => [...prev, { id: msgId, role: 'model', text: '' }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text;
        if (chunkText) {
            fullResponse += chunkText;
            
            setMessages(prev => prev.map(m => 
            m.id === msgId ? { ...m, text: fullResponse } : m
            ));
        }
      }

    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'system', 
        text: `ERROR: UPLINK FAILED. ${error.message || 'Unknown error'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs md:text-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[85%] p-2 rounded ${
               msg.role === 'user' 
                 ? 'bg-green-900/30 text-green-300 border border-green-700' 
                 : msg.role === 'system'
                 ? 'text-red-400 italic'
                 : 'text-green-400'
             }`}>
               <span className="font-bold text-[10px] opacity-50 block mb-1 uppercase">
                 {msg.role === 'model' ? 'HQ_INTEL' : msg.role}
               </span>
               <div className="whitespace-pre-wrap">{msg.text}</div>
             </div>
          </div>
        ))}
        {isLoading && (
           <div className="text-green-500 animate-pulse text-xs pl-2">
             <span className="mr-2"></span>PROCESSING INTEL...
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-green-800 bg-black flex gap-2">
        <span className="text-green-500 py-2"></span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-900"
          placeholder="Enter command..."
          autoFocus
        />
        <button 
          type="submit"
          disabled={isLoading} 
          className="p-2 text-green-800 hover:text-green-500 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
