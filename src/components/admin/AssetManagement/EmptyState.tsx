
import React from 'react';
import { FileImage } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium">No assets found</p>
      <p>Try adjusting your search or filters</p>
    </div>
  );
};

export default EmptyState;
