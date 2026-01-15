'use client';

import allIngredients from '@/lib/ingredients.json';
import { useEffect, useRef, useState } from 'react';

interface ChatInterfaceProps {
  ingredients: string[];
  onAdd: (ing: string) => void;
  onRemove: (ing: string) => void;
}

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function ChatInterface({ ingredients, onAdd, onRemove }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: "Hello. I am your Quantum Chef. What ingredients do you have in your inventory today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Suggestion Logic
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allIngredients.filter(ing =>
        ing.toLowerCase().includes(inputValue.toLowerCase()) &&
        !ingredients.includes(ing)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, ingredients]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setSuggestions([]);

    // 2. Process Input (Mock AI Delay)
    setIsTyping(true);

    // Try to find if input matches an ingredient directly
    const match = allIngredients.find(ing => ing.toLowerCase() === text.toLowerCase());

    setTimeout(() => {
      setIsTyping(false);

      let responseText = "";
      if (match) {
        onAdd(match);
        responseText = `Added ${match} to your inventory. What else?`;
      } else {
        // Simple NLP simulation
        const found = allIngredients.find(ing => text.toLowerCase().includes(ing.toLowerCase()));
        if (found) {
          onAdd(found);
          responseText = `I see you have ${found}. I've added it to the list.`;
        } else {
          responseText = "I couldn't identify a known ingredient in that message. Try listing an item like 'chicken' or 'tomatoes'.";
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

    }, 1000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-enter`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
              <p>{msg.text}</p>
              <span className="text-[10px] opacity-40 mt-2 block">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-enter">
            <div className="chat-bubble-ai flex gap-2 items-center h-10">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#050505]/80 backdrop-blur-md border-t border-white/5 relative z-20">

        {/* Active Tags (Mini View) */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 px-2">
            {ingredients.map(ing => (
              <span key={ing} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/50 flex items-center gap-1">
                {ing}
                <button onClick={() => onRemove(ing)} className="hover:text-white">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Floating Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(s)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-white/70 hover:text-white transition-colors border-b border-white/5 last:border-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Type ingredient..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-white/30"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
