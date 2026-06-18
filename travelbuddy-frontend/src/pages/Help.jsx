import React, { useState } from 'react';
import { useContext } from 'react';
import {
  Search,
  Plane,
  Hotel,
  CreditCard,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Map,
  Train,
  CarTaxiFront
} from 'lucide-react';
import { ChatContext } from '../context/ChatContext';

const Help = () => {
  const { openChat } = useContext(ChatContext);
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const supportCategories = [
    { icon: Plane, title: 'Flights', desc: 'Booking, cancellations, and boarding passes' },
    { icon: Hotel, title: 'Hotels', desc: 'Check-in, modifications, and room upgrades' },
    { icon: Train, title: 'Trains', desc: 'Schedules, PNR status, and seat selection' },
    { icon: CarTaxiFront, title: 'Cabs', desc: 'Airport transfers and local rentals' },
    { icon: Map, title: 'Packages', desc: 'Curated tours and itinerary details' },
    { icon: CreditCard, title: 'Payments', desc: 'Payment history and invoices' }
  ];

  const faqs = [
    {
      question: "How do I cancel an existing booking?",
      answer: "You can cancel your booking directly from your Dashboard. Navigate to 'My Bookings', find the trip you wish to cancel, and click the 'Cancel' button. Please note that cancellation charges may apply based on the provider's policy."
    },
    {
      question: "Where can I find my upcoming trips?",
      answer: "All your confirmed bookings are listed in the 'Upcoming Trips' section under your Dashboard. You'll find full details including travel dates, hotel information, and total cost there."
    },
    {
      question: "Can I book a multi-city flight or tour package?",
      answer: "Yes! You can explore curated multi-city Tour Packages from the 'Packages' section. For custom flights, our chatbot can help you find the best routes and connecting flights."
    },
    {
      question: "I need immediate assistance. How can I reach support?",
      answer: "Our AI chat assistant is available 24/7. Just click the message bubble icon at the bottom right of your screen. For escalated issues, the chatbot will provide you with a customer support ticket."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 pb-24 pt-16 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">How can we help you?</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Search our knowledge base or browse categories to find the answers you need for a seamless travel experience.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-2xl border-0 ring-4 ring-blue-400/30 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/50 text-lg shadow-xl transition-all outline-none"
            placeholder="E.g. How do I cancel my flight?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {supportCategories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 p-6 flex items-start space-x-4 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <category.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-300"
                >
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support Banner */}
        <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-white mb-2">Still need help?</h3>
            <p className="text-gray-300">Our support team and AI Chatbot are available 24/7 to assist you.</p>
          </div>
          <button
            onClick={() => openChat()}
            className="flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat with us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;