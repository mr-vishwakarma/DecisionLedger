import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/useAuth';

const QUICK_QUESTIONS = [
  'How do I create a decision?',
  'How does voting work?',
  'What is the Timeline feature?',
  'How do I join or create a team?',
  'What does Analytics show?',
];

function formatAIText(text) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 4px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
    .replace(/\n/g, '<br/>');
  return { __html: html };
}

function TypingIndicator() {
  return (
    <div style={styles.typingContainer}>
      <span style={{fontSize:'12px', color:'rgba(255,255,255,0.5)', marginBottom:'4px', display:'block'}}>AI is typing...</span>
      <div style={{...styles.messageBubble, background: 'rgba(255,255,255,0.05)', width: '60px', height: '36px', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', border: 'none'}}>
        <div style={styles.typingDot(0)} />
        <div style={styles.typingDot(1)} />
        <div style={styles.typingDot(2)} />
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', alignSelf: isUser ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
        {isUser ? 'You' : 'DecisionLedger AI'}
      </span>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          ...styles.messageBubble,
          background: isUser ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
          border: 'none',
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
    </div>
  );
}

export default function AIChatWidget() {
  const { user, token, showAiChat, setShowAiChat } = useAuth();
  const isLoggedIn = !!token;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      text: `👋 Hi **${user?.name?.split(' ')[0] || 'there'}**! I'm your DecisionLedger AI Assistant.\n\nAsk me anything about the app — how to create decisions, vote, use analytics, manage teams, and more!`,
    },
    
    ...(isLoggedIn ? [{
      id: 'gov-welcome',
      role: 'model',
      text: `🛡️ Welcome to Governance AI. I can access your company profile data and answer real‑time questions about the app.\n\n*Developer: Ram Vishwakarma*`,
    }] : []),
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/api/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: trimmed, history: geminiHistory }),
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

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <>
      
      <AnimatePresence>
        {isLoggedIn && showAiChat && (
          <motion.div
            id="ai-chat-panel"
            key="governance-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={styles.panelTopRight}
          >
            
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.botIconSmall}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#22c55e" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" fill="#22c55e" />
                  </svg>
                </div>
                <div>
                  <div style={styles.headerTitle}>Governance AI</div>
                  <div style={styles.headerSubtitle}>
                    <span style={styles.statusDot} /> Online – real‑time company data
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                    Developer: Ram Vishwakarma
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAiChat(false)} style={styles.closeButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

          
          {showQuickQuestions && messages.length === 1 && !isLoading && (
            <div style={styles.quickQuestionsWrapper}>
              <div style={styles.quickQuestionsTitle}>Suggested inquiries</div>
              <div style={styles.quickQuestionsContainer}>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={styles.quickQuestionBtn}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          
          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          
          <div style={styles.inputWrapper}>
            <div style={styles.inputPill}>
              <button style={styles.iconButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <textarea
                ref={inputRef}
                id="ai-chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Governance AI..."
                style={styles.input}
                rows={1}
                disabled={isLoading}
              />
              <button style={styles.iconButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                </svg>
              </button>
              <button
                onClick={() => sendMessage(inputText)}
                disabled={isLoading || !inputText.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: isLoading || !inputText.trim() ? 0.5 : 1,
                  cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div style={styles.footer}>
              AI can make mistakes. Verify critical information.
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      
      <AnimatePresence>
        {isOpen && !isLoggedIn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.backdrop}
              onClick={handleToggle}
            />
            <motion.div
              id="ai-chat-panel"
              key="chat-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={styles.panel}
            >
              
              <div style={styles.header}>
                <div style={styles.headerLeft}>
                  <div style={styles.botIconSmall}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#22c55e" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="3" fill="#22c55e" />
                    </svg>
                  </div>
                  <div>
                    <div style={styles.headerTitle}>Governance AI (Guest)</div>
                    <div style={styles.headerSubtitle}>
                      <span style={styles.statusDot} /> Online and ready
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      Developer: Ram Vishwakarma
                    </div>
                  </div>
                </div>
                <button onClick={handleToggle} style={styles.closeButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              
              {showQuickQuestions && messages.length === 1 && !isLoading && (
                <div style={styles.quickQuestionsWrapper}>
                  <div style={styles.quickQuestionsTitle}>Suggested inquiries</div>
                  <div style={styles.quickQuestionsContainer}>
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        style={styles.quickQuestionBtn}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              
              <div style={styles.messagesContainer}>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              
              <div style={styles.inputWrapper}>
                <div style={styles.inputPill}>
                  <button style={styles.iconButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  
                  <textarea
                    ref={inputRef}
                    id="ai-chat-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Governance AI..."
                    style={styles.input}
                    rows={1}
                    disabled={isLoading}
                  />

                  <button style={styles.iconButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line>
                    </svg>
                  </button>

                  <button
                    onClick={() => sendMessage(inputText)}
                    disabled={isLoading || !inputText.trim()}
                    style={{
                      ...styles.sendButton,
                      opacity: isLoading || !inputText.trim() ? 0.5 : 1,
                      cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div style={styles.footer}>
                  AI can make mistakes. Verify critical information.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
      {!isOpen && !isLoggedIn && (
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.fab}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.button>
      )}
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 9997,
  },
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    zIndex: 9999,
  },
  
  panel: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    width: '420px',
    maxWidth: '100vw',
    background: '#09090b',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9998,
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
  },
  
  panelTopRight: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '360px',
    maxWidth: '90vw',
    background: '#111113',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999,
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  botIconSmall: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#22c55e',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    padding: '4px',
  },
  quickQuestionsWrapper: {
    padding: '24px 24px 0',
  },
  quickQuestionsTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  quickQuestionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  quickQuestionBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '8px 14px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.1) transparent',
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#fff',
  },
  messageText: {
    display: 'block',
  },
  typingContainer: {
    alignSelf: 'flex-start',
  },
  typingDot: (i) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.6)',
    animation: `ai-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
  }),
  inputWrapper: {
    padding: '20px 24px',
    background: '#09090b',
  },
  inputPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '8px 10px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '14.5px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '24px',
    maxHeight: '120px',
    overflowY: 'auto',
    padding: '4px 0',
  },
  sendButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  footer: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    marginTop: '12px',
  },
};

if (typeof document !== 'undefined') {
  const styleId = 'ai-chat-widget-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes ai-bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-4px); }
      }
      #ai-chat-input::placeholder {
        color: rgba(255,255,255,0.3);
      }
      #ai-chat-panel::-webkit-scrollbar { width: 6px; }
      #ai-chat-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      #ai-chat-input::-webkit-scrollbar { width: 4px; }
      #ai-chat-input::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
    `;
    document.head.appendChild(style);
  }
}
