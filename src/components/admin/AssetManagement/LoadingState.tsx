
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
