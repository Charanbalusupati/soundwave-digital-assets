
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Asset = Database['public']['Tables']['assets']['Row'];
type AssetInsert = Database['public']['Tables']['assets']['Insert'];
type AssetUpdate = Database['public']['Tables']['assets']['Update'];

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUploads: 0,
    imageCount: 0,
    audioCount: 0,
    totalDownloads: 0,
    mostDownloaded: null as Asset | null
  });
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
      
      // Calculate stats
      const totalUploads = data?.length || 0;
      const imageCount = data?.filter(asset => asset.file_type.startsWith('image')).length || 0;
      const audioCount = data?.filter(asset => asset.file_type.startsWith('audio')).length || 0;
      const totalDownloads = data?.reduce((sum, asset) => sum + (asset.download_count || 0), 0) || 0;
      const mostDownloaded = data?.reduce((max, asset) => 
        (asset.download_count || 0) > (max?.download_count || 0) ? asset : max, data[0]
      ) || null;

      setStats({
        totalUploads,
        imageCount,
        audioCount,
        totalDownloads,
        mostDownloaded
      });
    } catch (error: any) {
      toast({
        title: 'Error fetching assets',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async (file: File, metadata: Omit<AssetInsert, 'file_path' | 'file_size' | 'uploaded_by'>) => {
    try {
      setLoading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert asset record
      const { data, error } = await supabase
        .from('assets')
        .insert({
          ...metadata,
          file_path: filePath,
          file_size: file.size,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setAssets(prev => [data, ...prev]);
      toast({
        title: 'Asset uploaded successfully',
        description: `${metadata.title} has been uploaded.`
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAsset = async (id: string, updates: AssetUpdate) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAssets(prev => prev.map(asset => asset.id === id ? data : asset));
      toast({
        title: 'Asset updated',
        description: 'Asset has been updated successfully.'
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      // Get asset to find file path
      const asset = assets.find(a => a.id === id);
      if (!asset) throw new Error('Asset not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('assets')
        .remove([asset.file_path]);

      if (storageError) console.warn('Storage deletion failed:', storageError);

      // Delete from database
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));
      toast({
        title: 'Asset deleted',
        description: 'Asset has been deleted successfully.'
      });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    stats,
    loading,
    uploadAsset,
    updateAsset,
    deleteAsset,
    refetch: fetchAssets
  };
};
