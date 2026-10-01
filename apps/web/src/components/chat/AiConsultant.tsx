'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

export function AiConsultant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I am your impextech AI advisor. Looking for a gadget recommendation, spec comparison, or budget advice?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            });
            const data = await res.json() as { reply?: string };
            
            if (data.reply) {
                const replyText = data.reply;
                setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I ran into an issue connecting to the advisor service.' }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect. Please reach out via WhatsApp for immediate support.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Bubble Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2 border border-slate-700/60"
                    aria-label="Ask AI Consultant"
                >
                    <div className="relative">
                        <Bot size={22} className="text-red-400" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <span className="font-semibold text-sm hidden md:block">Ask AI Advisor</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-3xl shadow-2xl w-[350px] sm:w-[400px] h-[520px] flex flex-col border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-950 text-white p-4 flex justify-between items-center border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">impex<span className="text-red-500">tech</span> Advisor</h3>
                                <p className="text-[11px] text-slate-400">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="hover:bg-slate-800 p-1.5 rounded-full transition-colors text-slate-400 hover:text-white"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Message Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-red-600 text-white self-end rounded-br-none shadow-sm' 
                                        : 'bg-white border border-slate-200 text-slate-800 self-start rounded-bl-none shadow-sm'
                                }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white border border-slate-200 text-slate-500 self-start p-3 rounded-2xl rounded-bl-none text-xs flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="e.g. iPad Air M1 vs M2?" 
                            className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-900 placeholder:text-slate-400"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-2.5 rounded-full transition-colors flex items-center justify-center min-w-[40px] shadow-sm"
                            aria-label="Send"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
