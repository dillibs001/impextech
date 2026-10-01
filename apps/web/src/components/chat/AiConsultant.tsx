'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

export function AiConsultant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I am your ImpexTech AI consultant. Are you looking for a specific gadget or need a recommendation?' }
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
            const data = await res.json();
            
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect.' }]);
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
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                    <MessageCircle size={24} />
                    <span className="font-semibold hidden md:block">Ask AI Consultant</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">ImpexTech Consultant</h3>
                            <p className="text-xs text-emerald-100">Powered by Gemini AI</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-500 p-1 rounded transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Message Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white self-end rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 self-start rounded-bl-none'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white border border-slate-200 text-slate-800 self-start p-3 rounded-2xl rounded-bl-none text-sm max-w-[80%] flex gap-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce delay-100">.</span>
                                <span className="animate-bounce delay-200">.</span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="e.g. iPad Air M1 vs M2?" 
                            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2 rounded-full transition-colors flex items-center justify-center min-w-[40px]"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
