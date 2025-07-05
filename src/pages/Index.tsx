
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedAssets from '../components/FeaturedAssets';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedAssets />
      
      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Stay Updated
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Get notified about new premium assets and exclusive content
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
            />
            <button className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
