
import React, { useState } from 'react';
import { LayoutDashboard, Upload, FileImage, Users, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import DashboardOverview from '../components/admin/DashboardOverview';
import AssetUploadForm from '../components/admin/AssetUploadForm';
import AssetManagement from '../components/admin/AssetManagement';
import UserActivityManager from '../components/admin/UserActivityManager';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'assets', label: 'Manage Assets', icon: FileImage },
    { id: 'users', label: 'User Activity', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'upload':
        return <AssetUploadForm onUploadComplete={() => setActiveTab('assets')} />;
      case 'assets':
        return <AssetManagement />;
      case 'users':
        return <UserActivityManager />;
      case 'settings':
        return (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h3>
            <p className="text-gray-600">Platform configuration and preferences will be available here.</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

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
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
