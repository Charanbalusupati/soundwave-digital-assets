
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-2xl">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-2 bg-white/70 border border-white/30 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
