import React from 'react';

interface ViewAllButtonProps {
  href: string;
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({ href }) => {
  return (
    <a
      href={href}
      className="btn-primary-outline text-sm font-medium"
    >
      View all activities
    </a>
  );
};

export default ViewAllButton;