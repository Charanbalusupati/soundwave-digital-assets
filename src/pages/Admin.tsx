
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Audio, Dashboard, Users, Settings, BarChart3, Download, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dragActive, setDragActive] = useState(false);

  const stats = [
    { label: 'Total Uploads', value: '1,247', icon: Upload, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Downloads', value: '3,892', icon: Download, color: 'from-green-500 to-green-600' },
    { label: 'User Count', value: '15,234', icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'Top Performing', value: 'Epic Beat', icon: BarChart3, color: 'from-orange-500 to-orange-600' },
  ];

  const recentUploads = [
    { id: 1, title: 'Ambient Dreams', type: 'audio', status: 'published', downloads: 1247 },
    { id: 2, title: 'Abstract Art', type: 'image', status: 'published', downloads: 892 },
    { id: 3, title: 'Electronic Vibes', type: 'audio', status: 'draft', downloads: 0 },
    { id: 4, title: 'Nature Photo', type: 'image', status: 'published', downloads: 543 },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'assets', label: 'Assets', icon: ImageIcon },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Uploads */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Uploads</h3>
        <div className="space-y-4">
          {recentUploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  upload.type === 'audio' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {upload.type === 'audio' ? <Audio className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{upload.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{upload.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{upload.downloads} downloads</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  upload.status === 'published' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {upload.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-8">Upload New Asset</h3>
        
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-700 mb-2">
            Drop files here or click to browse
          </h4>
          <p className="text-gray-500 mb-6">
            Support for audio files (MP3, WAV) and images (JPG, PNG, SVG)
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-200">
            Select Files
          </button>
        </div>

        {/* Upload Form */}
        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter asset title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select category...</option>
                <option>Audio - Electronic</option>
                <option>Audio - Ambient</option>
                <option>Audio - Cinematic</option>
                <option>Image - Abstract</option>
                <option>Image - Nature</option>
                <option>Image - Technology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tags separated by commas..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter asset description..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700">Publish immediately</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Upload Asset
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pb-20">
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'upload' && renderUpload()}
              {activeTab === 'assets' && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Assets Management</h3>
                  <p className="text-gray-600">Manage your uploaded assets here.</p>
                </div>
              )}
              {activeTab === 'users' && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Users Management</h3>
                  <p className="text-gray-600">Manage platform users here.</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h3>
                  <p className="text-gray-600">Configure platform settings here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
