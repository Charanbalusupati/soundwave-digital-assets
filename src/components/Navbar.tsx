
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              SoundSnap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/browse" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group"
            >
              Browse
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1 relative group"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user && user.email_confirmed_at ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 hover:bg-white/90 transition-all duration-200 shadow-sm"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700 max-w-32 truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-xl py-2 animate-scale-in">
                    <div className="px-4 py-3 border-b border-gray-200/50">
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      {isAdmin && (
                        <p className="text-xs text-blue-600 font-medium mt-1">Administrator</p>
                      )}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-xl border border-white/30 mt-2 mb-4 py-4 px-4 space-y-4 shadow-xl animate-fade-in">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="block text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              {user && user.email_confirmed_at ? (
                <div className="space-y-3">
                  <div className="bg-gray-50/80 rounded-lg p-3">
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-blue-600 font-medium mt-1">Administrator</p>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-red-600 transition-colors w-full py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-center shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
