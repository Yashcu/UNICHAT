import React from 'react';
import { Circular } from '../../types';
import { format } from 'date-fns';
import { FileText, Download, Share } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CircularCardProps {
  circular: Circular;
  onClick: (circular: Circular) => void;
  isSelected?: boolean;
}

const CircularCard: React.FC<CircularCardProps> = ({ 
  circular, 
  onClick,
  isSelected = false
}) => {

  const handleCardClick = () => {
    onClick(circular);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    console.log('Download clicked for circular:', circular.title);
    // TODO: Implement download functionality
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    console.log('Share clicked for circular:', circular.title);
    // TODO: Implement share functionality
  };

  return (
    <div
      className={cn(
        "card border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer transition-all duration-200 p-4",
        isSelected && "ring-2 ring-primary-500"
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start">
        <div className="rounded-lg bg-primary-50 shadow-sm p-3 text-primary-600 mr-4">
          <FileText size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {circular.title}
          </h3>

          <div className="flex items-center text-xs text-gray-700 mb-2">
            <span>Posted by {circular.postedBy.name}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(circular.postedAt), "MMM d, yyyy")}</span>
          </div>

          {circular.summary && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {circular.summary}
            </p>
          )}

          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center text-xs font-medium text-gray-500 rounded-md hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors duration-150"
              onClick={handleDownloadClick}
            >
              <Download size={14} className="mr-1" />
              Download
            </button>
            <button
              className="inline-flex items-center text-xs font-medium text-gray-500 rounded-md hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors duration-150"
              onClick={handleShareClick}
            >
              <Share size={14} className="mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularCard;