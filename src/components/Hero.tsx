
import React from 'react';
import { Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800" />
      
      {/* Animated background elements - hidden on mobile for performance */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
          Download Premium
          <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Digital Assets & Tracks
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 font-light">
            Instantly
          </span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-blue-100 font-light leading-relaxed max-w-3xl mx-auto">
          Discover thousands of high-quality audio tracks and digital images.
          <br className="hidden sm:block" />
          Perfect for creators, developers, and content makers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto sm:max-w-none">
          <Link
            to="/browse"
            className="group bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span>Browse Assets</span>
          </Link>
          
          <Link
            to="/browse"
            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Play className="w-5 h-5 group-hover:animate-pulse" />
            <span>Try for Free</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 text-center max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-2">10K+</div>
            <div className="text-blue-200 text-sm md:text-base">Audio Tracks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-2">25K+</div>
            <div className="text-blue-200 text-sm md:text-base">Digital Images</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20">
            <div className="text-2xl md:text-3xl font-bold mb-2">50K+</div>
            <div className="text-blue-200 text-sm md:text-base">Happy Users</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
