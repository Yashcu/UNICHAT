import React from 'react';
import { MessageSquare } from 'lucide-react';

const AuthBranding = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary-500 text-white p-3">
          <MessageSquare size={24} />
        </div>
      </div>
      <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
        Unichat AI
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Smart Campus Communication System
      </p>
    </div>
  );
};

export default AuthBranding;