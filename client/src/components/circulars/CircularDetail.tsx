import React from 'react';
import { Circular } from '../../types';
import { format } from 'date-fns';
import { Download, Share, X } from 'lucide-react';

interface CircularDetailProps {
  circular: Circular;
  onClose: () => void;
}

const CircularDetail: React.FC<CircularDetailProps> = ({ circular, onClose }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{circular.title}</h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="avatar h-10 w-10">
              <img 
                src={circular.postedBy.profilePic || `https://ui-avatars.com/api/?name=${circular.postedBy.name}&background=4F46E5&color=fff`} 
                alt={circular.postedBy.name} 
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {circular.postedBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(circular.postedAt), 'PPpp')}
              </p>
            </div>
          </div>
          
          {circular.summary && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                AI-Generated Summary
              </h3>
              <p className="text-sm text-gray-600">
                {circular.summary}
              </p>
            </div>
          )}
          
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{circular.content}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
          <button className="btn-outline text-sm flex items-center">
            <Download size={16} className="mr-2" />
            Download
          </button>
          <button className="btn-outline text-sm flex items-center">
            <Share size={16} className="mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircularDetail;