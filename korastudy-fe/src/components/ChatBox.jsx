import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader, Sparkles } from 'lucide-react';
import geminiService from '../api/geminiService';
import { AUTH_TOKEN_KEY } from '../config';
import './ChatBox.css';

/**
 * Component ChatBox - Trợ lý AI học tiếng Hàn
 * Hiển thị dưới dạng bong bóng chat ở góc trang web
 * Chỉ hiển thị khi user đã đăng nhập
 */
const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của KoraStudy. Tôi có thể giúp bạn học tiếng Hàn. Hãy hỏi tôi bất cứ điều gì về từ vựng, ngữ pháp, văn hóa Hàn Quốc nhé!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = geminiService.getQuickSuggestions();

  // Kiểm tra user đã đăng nhập chưa
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(!!token);
  }, []);

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus vào input khi mở chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Lấy lịch sử hội thoại (không bao gồm tin nhắn đầu tiên là greeting)
      const conversationHistory = messages
        .slice(1)
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      console.log('Đang gửi tin nhắn:', messageText.trim());
      const aiResponse = await geminiService.sendMessage(
        messageText.trim(),
        conversationHistory
      );
      console.log('Nhận được phản hồi:', aiResponse);

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ ${error.message || 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Không hiển thị chatbox nếu chưa đăng nhập
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="chatbox-bubble"
          aria-label="Mở chat với trợ lý AI"
        >
          <MessageCircle size={28} />
          <span className="chatbox-bubble-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbox-container">
          {/* Header */}
          <div className="chatbox-header">
            <div className="chatbox-header-content">
              <div className="chatbox-avatar">
                <Sparkles size={20} />
              </div>
              <div className="chatbox-header-text">
                <h3>Trợ lý AI KoraStudy</h3>
                <p>Học tiếng Hàn cùng AI</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="chatbox-close-btn"
              aria-label="Đóng chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbox-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbox-message ${
                  message.role === 'user' ? 'chatbox-message-user' : 'chatbox-message-assistant'
                } ${message.isError ? 'chatbox-message-error' : ''}`}
              >
                <div className="chatbox-message-content">
                  {message.content}
                </div>
                <div className="chatbox-message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbox-message chatbox-message-assistant">
                <div className="chatbox-message-content chatbox-typing">
                  <Loader className="chatbox-loader" size={16} />
                  <span>Đang suy nghĩ...</span>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && messages.length === 1 && !isLoading && (
              <div className="chatbox-suggestions">
                <p className="chatbox-suggestions-title">💡 Gợi ý câu hỏi:</p>
                <div className="chatbox-suggestions-grid">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="chatbox-suggestion-btn"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbox-input-container">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi về tiếng Hàn..."
              className="chatbox-input"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="chatbox-send-btn"
              aria-label="Gửi tin nhắn"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
