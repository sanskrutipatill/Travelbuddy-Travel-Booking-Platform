import { useState, useRef, useEffect } from 'react';
import { useContext } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ChatContext } from '../context/ChatContext';

const Chatbot = () => {
  const { isChatOpen, toggleChat, closeChat } = useContext(ChatContext);
  const [messages, setMessages] = useState([
    { text: "Hi! Where do you want to travel today?", isBot: true, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus();
    }
  }, [isChatOpen]);

  const generateBotReply = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase().trim();

    if (lowerMessage.includes('goa')) {
      return "Goa is best from Nov–Feb 🌴 Beaches, parties & Portuguese vibes!";
    }
    if (lowerMessage.includes('mumbai')) {
      return "Mumbai: City of Dreams! Best from Oct–Mar. Must visit: Gateway, Marine Drive, Food!";
    }
    if (lowerMessage.includes('delhi') || lowerMessage.includes('new delhi')) {
      return "Delhi: History & chaos! Best Oct–Mar. Red Fort, Qutub Minar, incredible street food!";
    }
    if (lowerMessage.includes('bangalore')) {
      return "Bangalore: Garden City! Great Sep–Feb. Parks, pubs, tech hub & cool weather!";
    }
    if (lowerMessage.includes('hotel')) {
      return "I can help you find amazing hotels! Use the search bar or tell me your destination & budget! 🏨";
    }
    if (lowerMessage.includes('flight')) {
      return "Search flights in the Flights section! Need help with routes? Ask away! ✈️";
    }
    if (lowerMessage.includes('package')) {
      return "Check our Packages section for curated trips! Budget, honeymoon, adventure - we have it all! 🎁";
    }
    if (lowerMessage.includes('train')) {
      return "🚂 Trains! Check the Trains section for availability. Book early for confirmed seats!";
    }
    if (lowerMessage.includes('cab') || lowerMessage.includes('taxi')) {
      return "🚗 Cabs available! Tell me pickup & drop location. Or use the Cabs section directly!";
    }
    if (lowerMessage.includes('help')) {
      return "I can assist with: destinations, bookings, hotels, flights, packages, and general travel advice! What would you like to know?";
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm TravelBuddy AI. Where would you like to travel?";
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! ✨ Need anything else? Happy to help!";
    }
    if (lowerMessage.includes('bye')) {
      return "Safe travels! 🧳✈️ Come back if you need more help!";
    }

    return "I can help you find destinations, hotels, flights, or travel packages! What are you looking for?";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue.trim(), isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botReply = { text: generateBotReply(inputValue.trim()), isBot: true, timestamp: new Date() };
      setMessages((prev) => [...prev, botReply]);
    }, 500);
  };


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <div
        className={`mb-4 transition-all duration-300 ease-out origin-bottom-right ${
          isChatOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-[380px] max-w-[calc(100vw-3rem)] sm:w-[400px] bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden flex flex-col max-h-[550px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">🤖</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">TravelBuddy AI</h3>
                <p className="text-blue-100 text-xs">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.isBot
                      ? 'bg-white border border-gray-200 text-gray-800'
                      : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isBot ? 'text-gray-400' : 'text-blue-100'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                id="chatbot-message-input"
                name="message"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm text-gray-800 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={`group relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center`}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Pulsing ring animation */}
        <span className={`absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping ${isChatOpen ? 'hidden' : ''}`}></span>

        {/* Icon */}
        <div className="relative z-10">
          {isChatOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white" />
          )}
        </div>

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isChatOpen ? 'Close' : 'Chat with us!'}
        </span>
      </button>
    </div>
  );
};

export default Chatbot;
