
import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Download, Music, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAssets } from '@/hooks/useAssets';
import AssetEditModal from './AssetEditModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
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
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Manage Assets</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 backdrop-blur-sm border border-white/20"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-32 bg-white/60 backdrop-blur-sm border border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
        </div>

        <div className="space-y-4">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No assets found</p>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      asset.file_type.startsWith('audio') 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {asset.file_type.startsWith('audio') ? (
                        <Music className="w-6 h-6" />
                      ) : (
                        <FileImage className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800 truncate">{asset.title}</h4>
                        <Badge variant={asset.is_published ? "default" : "secondary"}>
                          {asset.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>Type: {asset.file_type}</span>
                        <span>Size: {formatFileSize(asset.file_size)}</span>
                        <span>Uploaded: {formatDate(asset.created_at)}</span>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{asset.download_count || 0} downloads</span>
                        </div>
                      </div>
                      
                      {asset.tags && asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {asset.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {asset.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{asset.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAsset(asset)}
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingAsset(asset)}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
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
