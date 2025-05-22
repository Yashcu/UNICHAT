import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatbotInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m the Campus AI Assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        "Based on the campus calendar, the library will be open until midnight during finals week.",
        "The deadline for course registration is April 15th. You can access the registration portal through your student dashboard.",
        "According to university policy, you need to maintain a GPA of 2.5 to keep your scholarship.",
        "The Computer Science department office is located in Building C, Room 210. Their office hours are from 9 AM to 4 PM on weekdays.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const messageExamples = [
    "When is the deadline for course registration?",
    "What are the library hours during finals week?",
    "How do I apply for on-campus housing?",
    "Where is the Computer Science department office located?",
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-primary-500 text-white p-4">
        <div className="flex items-center">
          <Bot className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-semibold">Campus AI Assistant</h2>
        </div>
        <p className="text-sm text-primary-100 mt-1">
          I can answer questions about campus policies, events, and resources
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex",
              message.isBot ? "justify-start" : "justify-end"
            )}
          >
            <div className="flex items-start max-w-[80%]">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center mr-2",
                message.isBot ? "bg-primary-100 text-primary-600" : "bg-gray-200 text-gray-600"
              )}>
                {message.isBot ? <Bot size={16} /> : <User size={16} />}
              </div>
              
              <div className={cn(
                "rounded-lg px-4 py-3",
                message.isBot 
                  ? "bg-white border border-gray-200" 
                  : "bg-primary-500 text-white"
              )}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start max-w-[80%]">
              <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-primary-100 text-primary-600">
                <Bot size={16} />
              </div>
              
              <div className="rounded-lg px-4 py-3 bg-white border border-gray-200">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length === 1 && (
        <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {messageExamples.map((example, i) => (
              <button
                key={i}
                className="text-xs text-left px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                onClick={() => setInput(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Ask a question about campus..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="ml-2 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotInterface;