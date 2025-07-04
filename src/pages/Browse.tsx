import React, { useState } from 'react';
import { Search, Filter, Download, Play, Image as ImageIcon, Volume2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import AudioPlayer from '../components/AudioPlayer';

const Browse = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const assets = [
    {
      id: 1,
      title: "Ambient Dreams",
      type: "audio",
      duration: "3:24",
      downloads: 1247,
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      tags: ["ambient", "relaxing", "meditation"]
    },
    {
      id: 2,
      title: "Epic Cinematic",
      type: "audio",
      duration: "2:47",
      downloads: 892,
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
      tags: ["cinematic", "epic", "orchestral"]
    },
    {
      id: 3,
      title: "Abstract Geometry",
      type: "image",
      size: "4K Resolution",
      downloads: 2341,
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop",
      tags: ["abstract", "geometry", "colorful"]
    },
    {
      id: 4,
      title: "Nature Landscape",
      type: "image",
      size: "6K Resolution",
      downloads: 1876,
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      tags: ["nature", "landscape", "mountains"]
    },
    {
      id: 5,
      title: "Electronic Beat",
      type: "audio",
      duration: "4:12",
      downloads: 1543,
      thumbnail: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=400&h=400&fit=crop",
      tags: ["electronic", "beat", "dance"]
    },
    {
      id: 6,
      title: "Minimalist Design",
      type: "image",
      size: "8K Resolution",
      downloads: 987,
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
      tags: ["minimalist", "design", "clean"]
    }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesTab = activeTab === 'all' || asset.type === activeTab;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handlePlayTrack = (track: any) => {
    if (track.type === 'audio') {
      setCurrentTrack(track);
    }
  };

  const AssetCard = ({ asset }: { asset: any }) => (
    <div className="group bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <img
          src={asset.thumbnail}
          alt={asset.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button for audio */}
        {asset.type === 'audio' && (
          <button
            onClick={() => handlePlayTrack(asset)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <Play className="w-6 h-6 text-blue-600 ml-1" />
          </button>
        )}

        {/* Type indicator */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          {asset.type === 'audio' ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <ImageIcon className="w-4 h-4 text-white" />
          )}
          <span className="text-white text-xs font-medium capitalize">{asset.type}</span>
        </div>

        {/* Download button */}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
          <Download className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{asset.title}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span>{asset.type === 'audio' ? asset.duration : asset.size}</span>
          <span>{asset.downloads.toLocaleString()} downloads</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {asset.tags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Browse Assets
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover thousands of high-quality audio tracks and digital images
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-full p-1 border border-white/20">
                {[
                  { id: 'all', label: 'All Assets', icon: Filter },
                  { id: 'audio', label: 'Audio', icon: Volume2 },
                  { id: 'image', label: 'Images', icon: ImageIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Load More Assets
            </button>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {currentTrack && (
        <AudioPlayer
          track={currentTrack}
          onClose={() => setCurrentTrack(null)}
        />
      )}
    </div>
  );
};

export default Browse;
