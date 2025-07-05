
import React, { useState } from 'react';
import { useAssets } from '@/hooks/useAssets';
import AssetEditModal from './AssetEditModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import AssetCard from './AssetManagement/AssetCard';
import AssetFilters from './AssetManagement/AssetFilters';
import EmptyState from './AssetManagement/EmptyState';
import LoadingState from './AssetManagement/LoadingState';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];

const AssetManagement: React.FC = () => {
  const { assets, loading } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'image' && asset.file_type.startsWith('image/')) ||
                       (filterType === 'audio' && asset.file_type.startsWith('audio/'));
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'published' && asset.is_published) ||
                         (filterStatus === 'draft' && !asset.is_published);

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Manage Assets</h3>
          <AssetFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />
        </div>

        <div className="space-y-4">
          {filteredAssets.length === 0 ? (
            <EmptyState />
          ) : (
            filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onEdit={setEditingAsset}
                onDelete={setDeletingAsset}
              />
            ))
          )}
        </div>
      </div>

      {editingAsset && (
        <AssetEditModal
          asset={editingAsset}
          isOpen={!!editingAsset}
          onClose={() => setEditingAsset(null)}
        />
      )}

      {deletingAsset && (
        <DeleteConfirmDialog
          asset={deletingAsset}
          isOpen={!!deletingAsset}
          onClose={() => setDeletingAsset(null)}
        />
      )}
    </div>
  );
};

export default AssetManagement;
