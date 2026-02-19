import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../services/api';
import { useSelector } from 'react-redux';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const userId = user?.id;
  const sessionStorageKey = useMemo(() => (userId ? `aiSessionId:${userId}` : null), [userId]);
  const sessionIdRef = useRef(null);

  const ensureSessionId = () => {
    if (!userId) return null;
    if (sessionIdRef.current) return sessionIdRef.current;

    let existing = null;
    if (sessionStorageKey) {
      try {
        existing = localStorage.getItem(sessionStorageKey);
      } catch {
        existing = null;
      }
    }

    if (existing) {
      sessionIdRef.current = existing;
      return existing;
    }

    const suffix =
      (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const created = `session-${userId}-${suffix}`;
    sessionIdRef.current = created;

    if (sessionStorageKey) {
      try {
        localStorage.setItem(sessionStorageKey, created);
      } catch {
        // ignore
      }
    }

    return created;
  };

  useEffect(() => {
    // When user changes, reset local state.
    sessionIdRef.current = null;
    setMessages([]);
    setError(null);
  }, [userId]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!isOpen || !userId) return;
      const sessionId = ensureSessionId();
      if (!sessionId) return;

      setError(null);
      try {
        const res = await aiAPI.getChatHistory(sessionId);
        const history = res.data?.messages || [];
        // Server stores { role, content }
        if (Array.isArray(history)) setMessages(history);
      } catch (e) {
        // Don't block chat if history can't load.
      }
    };

    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const handleSend = async () => {
    if (!input.trim() || !userId) return;

    const sessionId = ensureSessionId();
    if (!sessionId) return;

    setError(null);

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiAPI.chat({
        message: input,
        sessionId,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.message },
      ]);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Chat failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] glass-card rounded-2xl shadow-2xl flex flex-col z-50"
            data-testid="ai-chat-window"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" data-testid="chat-title">Lumina AI</h3>
                  <p className="text-xs text-gray-500">Your shopping assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="close-chat-button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-sm" data-testid="chat-error">
                  {error}
                </div>
              )}
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8" data-testid="chat-empty-state">
                  <p>Hi! I'm your AI shopping assistant.</p>
                  <p className="text-sm mt-2">Ask me anything about products!</p>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid="chat-message"
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start" data-testid="chat-loading">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100">
              {user ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    data-testid="chat-input"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors disabled:opacity-50"
                    data-testid="send-message-button"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">Please login to chat</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-primary-hover transition-colors"
        data-testid="ai-chat-button"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default AIChatBot;