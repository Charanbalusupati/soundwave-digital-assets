
import React from 'react';
import { Music, FileImage, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onEdit, onDelete }) => {
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

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-lg border border-white/20 p-4">
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
            onClick={() => onEdit(asset)}
            className="hover:bg-blue-100 hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(asset)}
            className="hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
