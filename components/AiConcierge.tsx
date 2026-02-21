import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { getGeminiResponse } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const AiConcierge: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'こんにちは！OasysPark AIコンシェルジュです。おすすめのゲーム探しや、Oasysチェーンについて知りたいことはありますか？',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[600px] bg-slate-900/50 backdrop-blur rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center shadow-lg shadow-fuchsia-900/30">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white">AI Concierge</h2>
            <p className="text-xs text-green-400 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end max-w-[80%] md:max-w-[70%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`
                w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-fuchsia-600'}
              `}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              
              <div className={`
                p-3 rounded-2xl text-sm leading-relaxed shadow-md
                ${msg.role === 'user' 
                  ? 'bg-cyan-900/40 text-cyan-50 border border-cyan-800/50 rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                }
              `}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="min-h-[1.2em]">{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
               <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                 <Bot size={14} />
               </div>
               <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-300"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="RPGのおすすめは？"
            className="flex-1 bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputValue.trim() || isLoading}
            variant="primary"
            className="rounded-xl px-4 py-3"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          Powered by Gemini 1.5. AI can make mistakes.
        </p>
      </div>
    </div>
  );
};
