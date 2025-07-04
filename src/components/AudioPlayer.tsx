
import React, { useState } from 'react';
import { Play, Pause, Download, X, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  track?: {
    id: number;
    title: string;
    artist?: string;
    thumbnail: string;
    duration: string;
  };
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!track) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-white/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4 flex-1">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">{track.title}</h4>
            {track.artist && (
              <p className="text-sm text-gray-600 truncate">{track.artist}</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 flex-1 justify-center">
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <div className="flex items-center space-x-2 min-w-0 flex-1 max-w-xs">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}
            </span>
            <input
              type="range"
              min="0"
              max="204"
              value={progress}
              onChange={handleProgressChange}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">{track.duration}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
