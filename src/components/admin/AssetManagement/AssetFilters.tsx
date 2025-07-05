
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AssetFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterStatus,
  onFilterStatusChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/60 backdrop-blur-sm border border-white/20"
        />
      </div>
      <Select value={filterType} onValueChange={onFilterTypeChange}>
        <SelectTrigger className="w-full sm:w-32 bg-white/60 backdrop-blur-sm border border-white/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="audio">Audio</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-full sm:w-32 bg-white/60 backdrop-blur-sm border border-white/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssetFilters;
