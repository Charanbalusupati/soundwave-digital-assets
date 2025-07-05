
import React, { useEffect, useState } from 'react';
import { Upload, Download, FileImage, Music, BarChart3, TrendingUp } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { supabase } from '@/integrations/supabase/client';

const DashboardOverview: React.FC = () => {
  const { stats, loading } = useAssets();
  const [recentDownloads, setRecentDownloads] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentDownloads = async () => {
      try {
        const { data, error } = await supabase
          .from('downloads')
          .select(`
            id,
            downloaded_at,
            assets (
              title,
              file_type
            )
          `)
          .order('downloaded_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentDownloads(data || []);
      } catch (error) {
        console.error('Error fetching recent downloads:', error);
      }
    };

    fetchRecentDownloads();
  }, []);

  const statCards = [
    {
      label: 'Total Uploads',
      value: stats.totalUploads.toString(),
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      label: 'Image Assets',
      value: stats.imageCount.toString(),
      icon: FileImage,
      color: 'from-purple-500 to-purple-600',
      change: '+8%'
    },
    {
      label: 'Audio Assets',
      value: stats.audioCount.toString(),
      icon: Music,
      color: 'from-green-500 to-green-600',
      change: '+15%'
    },
    {
      label: 'Total Downloads',
      value: stats.totalDownloads.toString(),
      icon: Download,
      color: 'from-orange-500 to-orange-600',
      change: '+23%'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Downloaded Asset */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Top Performing Asset</span>
          </h3>
          
          {stats.mostDownloaded ? (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stats.mostDownloaded.file_type.startsWith('audio') 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {stats.mostDownloaded.file_type.startsWith('audio') ? (
                    <Music className="w-6 h-6" />
                  ) : (
                    <FileImage className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{stats.mostDownloaded.title}</h4>
                  <p className="text-sm text-gray-600">
                    {stats.mostDownloaded.download_count} downloads
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {stats.mostDownloaded.category?.replace('-', ' ') || 'Uncategorized'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No downloads yet</p>
            </div>
          )}
        </div>

        {/* Recent Downloads */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <Download className="w-6 h-6 text-green-600" />
            <span>Recent Downloads</span>
          </h3>
          
          <div className="space-y-3">
            {recentDownloads.length > 0 ? (
              recentDownloads.map((download) => (
                <div key={download.id} className="flex items-center justify-between p-3 bg-white/40 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      download.assets?.file_type?.startsWith('audio') 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {download.assets?.file_type?.startsWith('audio') ? (
                        <Music className="w-4 h-4" />
                      ) : (
                        <FileImage className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {download.assets?.title || 'Unknown Asset'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {download.downloaded_at ? 
                          new Date(download.downloaded_at).toLocaleDateString() : 
                          'Unknown date'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Download className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent downloads</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
            <Upload className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Upload Asset</span>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
            <FileImage className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Manage Assets</span>
          </button>
          <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
            <BarChart3 className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg">
            <Download className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Export Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
