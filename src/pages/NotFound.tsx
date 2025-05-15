import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-purple-600 mb-6">
        <Video size={56} />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
      >
        <Home size={18} className="mr-2" />
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;