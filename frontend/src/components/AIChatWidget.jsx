import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/useAuth';

// ─── Quick-start suggested questions ──────────────────────────────────────────
const QUICK_QUESTIONS = [
  'How do I create a decision?',
  'How does voting work?',
  'What is the Timeline feature?',
  'How do I join or create a team?',
  'What does Analytics show?',
];

// ─── Simple markdown-like formatter for AI responses ──────────────────────────
function formatAIText(text) {
  // Convert **bold** → <strong>, and line breaks → <br>
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.2);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/\n/g, '<br/>');
  return { __html: html };
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={styles.typingContainer}>
      <div style={styles.typingDot(0)} />
      <div style={styles.typingDot(1)} />
      <div style={styles.typingDot(2)} />
    </div>
  );
}

// ─── Individual Message Bubble ────────────────────────────────────────────────
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        ...styles.messageBubble,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        background: isUser
          ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
          : 'rgba(255,255,255,0.06)',
        borderBottomRightRadius: isUser ? 4 : 18,
        borderBottomLeftRadius: isUser ? 18 : 4,
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {isUser ? (
        <span style={styles.messageText}>{message.text}</span>
      ) : (
        <span
          style={styles.messageText}
          dangerouslySetInnerHTML={formatAIText(message.text)}
        />
      )}
    </motion.div>
  );
}

// ─── Main Widget Component ────────────────────────────────────────────────────
export default function AIChatWidget() {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      text: `👋 Hi **${user?.name?.split(' ')[0] || 'there'}**! I'm your DecisionLedger AI Assistant.\n\nAsk me anything about the app — how to create decisions, vote, use analytics, manage teams, and more!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState([]); // Gemini API history format
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [isPulsing, setIsPulsing] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const apiBase = import.meta.env.VITE_API_URL || '';

  // Stop pulse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiBase}/api/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: trimmed,
          history: geminiHistory,
        }),
      });

      if (!response.ok) {
        let errMessage = 'Request failed';
        try {
          const err = await response.json();
          errMessage = err.message || errMessage;
        } catch (parseError) {
          errMessage = `Server error (${response.status}). Please ensure the backend is running.`;
        }
        throw new Error(errMessage);
      }

      const data = await response.json();
      setGeminiHistory(data.history || []);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'model', text: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: `⚠️ ${error.message || 'Something went wrong. Please try again.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, token, geminiHistory, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setIsPulsing(false);
  };

  return (
    <>
      {/* ─── Chat Panel ─────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-panel"
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={styles.panel}
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.botIconSmall}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={styles.headerTitle}>DecisionLedger AI</div>
                  <div style={styles.headerSubtitle}>
                    <span style={styles.statusDot} /> Online · Gemini 2.5 Flash
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggle}
                style={styles.closeButton}
                aria-label="Close AI chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <div style={{ ...styles.messageBubble, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              {/* Quick questions */}
              {showQuickQuestions && messages.length === 1 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={styles.quickQuestionsContainer}
                >
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={styles.quickQuestionBtn}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.25)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
              <textarea
                ref={inputRef}
                id="ai-chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any feature..."
                style={styles.input}
                rows={1}
                disabled={isLoading}
              />
              <button
                id="ai-chat-send-btn"
                onClick={() => sendMessage(inputText)}
                disabled={isLoading || !inputText.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: isLoading || !inputText.trim() ? 0.45 : 1,
                  cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                }}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div style={styles.footer}>
              Powered by Gemini 2.5 Flash · Press Enter to send
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating Trigger Button ──────────────── */}
      <motion.button
        id="ai-chat-toggle-btn"
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={styles.fab}
        aria-label="Open AI Assistant"
        title="AI Assistant"
      >
        {/* Pulse ring */}
        {isPulsing && !isOpen && (
          <span style={styles.pulseRing} />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Sparkle / Bot icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)"/>
                <path d="M9 9h1v1H9zM14 9h1v1h-1zM9 14s.5 2 3 2 3-2 3-2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M12 1v2M12 21v2M1 12h2M21 12h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge shown when closed (1 = welcome message) */}
        {!isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={styles.badge}
          >
            AI
          </motion.span>
        )}
      </motion.button>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  // Floating action button
  fab: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(99,102,241,0.45), 0 2px 8px rgba(0,0,0,0.3)',
    zIndex: 9999,
    outline: 'none',
    overflow: 'visible',
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.4)',
    animation: 'ai-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
    pointerEvents: 'none',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: 'white',
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.03em',
    padding: '2px 5px',
    borderRadius: '10px',
    border: '2px solid rgba(10,10,20,0.9)',
    lineHeight: 1,
    fontFamily: 'Inter, system-ui, sans-serif',
  },

  // Panel
  panel: {
    position: 'fixed',
    bottom: '100px',
    right: '28px',
    width: '370px',
    height: '520px',
    borderRadius: '20px',
    background: 'rgba(13, 12, 26, 0.95)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(99,102,241,0.25)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9998,
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    background: 'linear-gradient(180deg, rgba(99,102,241,0.12) 0%, transparent 100%)',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  botIconSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: '-0.01em',
  },
  headerSubtitle: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '1px',
  },
  statusDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
  },
  closeButton: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.5)',
    transition: 'all 0.15s ease',
    outline: 'none',
    flexShrink: 0,
  },

  // Messages
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(99,102,241,0.3) transparent',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: '10px 14px',
    borderRadius: '18px',
    fontSize: '13.5px',
    lineHeight: '1.55',
    color: 'rgba(255,255,255,0.9)',
  },
  messageText: {
    display: 'block',
  },

  // Typing
  typingContainer: {
    display: 'flex',
    gap: '5px',
    padding: '4px 2px',
    alignItems: 'center',
  },
  typingDot: (i) => ({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.8)',
    animation: `ai-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
  }),

  // Quick questions
  quickQuestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignSelf: 'stretch',
    marginTop: '4px',
  },
  quickQuestionBtn: {
    textAlign: 'left',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '12.5px',
    color: 'rgba(99,102,241,0.9)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  },

  // Input
  inputArea: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    padding: '12px 14px 10px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.02)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '13.5px',
    color: 'rgba(255,255,255,0.9)',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    maxHeight: '100px',
    overflowY: 'auto',
    transition: 'border-color 0.15s ease',
    scrollbarWidth: 'thin',
  },
  sendButton: {
    width: '38px',
    height: '38px',
    borderRadius: '11px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
    flexShrink: 0,
  },

  // Footer
  footer: {
    textAlign: 'center',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.22)',
    padding: '6px 14px 10px',
    flexShrink: 0,
    letterSpacing: '0.01em',
  },
};

// ─── Inject keyframe animations into document head ───────────────────────────
if (typeof document !== 'undefined') {
  const styleId = 'ai-chat-widget-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes ai-pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes ai-bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-6px); }
      }
      #ai-chat-input:focus {
        border-color: rgba(99,102,241,0.5) !important;
        box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
      }
      #ai-chat-panel::-webkit-scrollbar { width: 4px; }
      #ai-chat-panel::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
    `;
    document.head.appendChild(style);
  }
}
