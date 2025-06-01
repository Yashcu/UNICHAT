import React from 'react';
import { Circular } from '../../types';
import { format } from 'date-fns';
import { Download, Share, X } from 'lucide-react';
import UserAvatar from '../shared/UserAvatar';

interface CircularDetailProps {
  circular: Circular;
  onClose: () => void;
}

const CircularDetail: React.FC<CircularDetailProps> = ({ circular, onClose }) => {

  const handleDownloadClick = () => {
    console.log('Download clicked for circular:', circular.title);
    // TODO: Implement download functionality
  };

  const handleShareClick = () => {
    console.log('Share clicked for circular:', circular.title);
    // TODO: Implement share functionality
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{circular.title}</h2>
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <UserAvatar user={circular.postedBy} size="h-10 w-10" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {circular.postedBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(circular.postedAt), "PPpp")}
              </p>
            </div>
          </div>

          {circular.summary && (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                AI-Generated Summary
              </h3>
              <p className="text-sm text-gray-600">
                {circular.summary}
              </p>
            </div>
          )}

          <div className="prose prose-sm max-w-none text-gray-800">
            <p className="whitespace-pre-line">{circular.content}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
          <button
            className="inline-flex items-center text-sm font-medium text-gray-500 rounded-md hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors duration-150"
            onClick={handleDownloadClick}
          >
            <Download size={16} className="mr-2" />
            Download
          </button>
          <button
            className="inline-flex items-center text-sm font-medium text-gray-500 rounded-md hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors duration-150"
            onClick={handleShareClick}
          >
            <Share size={16} className="mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircularDetail;