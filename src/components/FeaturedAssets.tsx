
import React from 'react';
import { Download, Play, Image, Audio } from 'lucide-react';

const FeaturedAssets = () => {
  const audioTracks = [
    {
      id: 1,
      title: "Ambient Dreams",
      type: "audio",
      duration: "3:24",
      downloads: 1247,
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Epic Cinematic",
      type: "audio",
      duration: "2:47",
      downloads: 892,
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
    },
  ];

  const images = [
    {
      id: 3,
      title: "Abstract Geometry",
      type: "image",
      size: "4K Resolution",
      downloads: 2341,
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Nature Landscape",
      type: "image",
      size: "6K Resolution",
      downloads: 1876,
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    },
  ];

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
          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <Play className="w-6 h-6 text-blue-600 ml-1" />
          </button>
        )}

        {/* Type indicator */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          {asset.type === 'audio' ? (
            <Audio className="w-4 h-4 text-white" />
          ) : (
            <Image className="w-4 h-4 text-white" />
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
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{asset.type === 'audio' ? asset.duration : asset.size}</span>
          <span>{asset.downloads.toLocaleString()} downloads</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Assets
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular audio tracks and digital images, 
            handpicked for quality and creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...audioTracks, ...images].map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            View All Assets
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAssets;
