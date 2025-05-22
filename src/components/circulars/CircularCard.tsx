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
  return (
    <div 
      className={cn(
        "card hover:shadow-md cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-primary-500"
      )}
      onClick={() => onClick(circular)}
    >
      <div className="flex items-start">
        <div className="rounded-lg bg-primary-100 p-3 text-primary-600 mr-4">
          <FileText size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {circular.title}
          </h3>
          
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span>Posted by {circular.postedBy.name}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(circular.postedAt), 'MMM d, yyyy')}</span>
          </div>
          
          {circular.summary && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {circular.summary}
            </p>
          )}
          
          <div className="flex items-center space-x-2">
            <button className="text-xs flex items-center text-gray-500 hover:text-primary-600">
              <Download size={14} className="mr-1" />
              Download
            </button>
            <button className="text-xs flex items-center text-gray-500 hover:text-primary-600">
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