import React from 'react';
import ChatbotInterface from '../components/assistant/ChatbotInterface';

const AssistantPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600">
          Get answers to campus-related questions
        </p>
      </div>
      
      <div className="h-[calc(100vh-12rem)]">
        <ChatbotInterface />
      </div>
    </div>
  );
};

export default AssistantPage;