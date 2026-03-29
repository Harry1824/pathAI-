import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    { role: 'model', content: `Hello ${user.name}. I am CampusPath AI. You can ask me anything about your roadmap to becoming a ${user.targetCareer}, or seek general guidance on skills and job nodes.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          message: userMessage,
          history: messages.map(({role, content}) => ({ role, content }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: "Error: Neural link degraded. Could not generate response." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Error: Connection lost with mainframe." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.3 }} className="max-w-4xl mx-auto h-[75vh] flex flex-col bg-panel border-2 border-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(102,252,241,0.15)] overflow-hidden backdrop-blur-xl">
      <div className="bg-black/60 border-b border-cyan/20 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-cyan animate-pulse shadow-[0_0_10px_#66fcf1]"></div>
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">CampusPath AI Uplink</h2>
        </div>
        <div className="text-xs text-cyan pr-4 font-mono">STATUS: ONLINE</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal text-xs font-bold mr-3 mt-1 shadow-[0_0_10px_rgba(69,162,158,0.3)]">AI</div>
            )}
            <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
              msg.role === 'user' 
              ? 'bg-gradient-to-r from-teal/80 to-cyan/80 text-black rounded-tr-none font-semibold' 
              : 'bg-black/60 border border-cyan/30 text-textMain rounded-tl-none font-medium'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal text-xs font-bold mr-3 shadow-[0_0_10px_rgba(69,162,158,0.3)]">AI</div>
            <div className="bg-black/60 border border-cyan/30 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-black/50 border-t border-cyan/20">
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            className="flex-1 bg-black/60 border border-cyan/40 text-white p-4 rounded-xl focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
            placeholder="Query the AI about your roadmap or anything else..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="px-8 bg-cyan/10 border-2 border-cyan text-cyan font-bold rounded-xl hover:bg-cyan hover:text-black hover:shadow-[0_0_20px_#66fcf1] transition-all disabled:opacity-50 disabled:hover:bg-cyan/10 disabled:hover:text-cyan disabled:hover:shadow-none font-mono tracking-widest"
          >
            SEND
          </button>
        </form>
      </div>
    </motion.div>
  );
}
