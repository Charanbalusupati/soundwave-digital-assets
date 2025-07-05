
import React, { useEffect, useState } from 'react';
import { Users, Download, Calendar, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface DownloadActivity {
  id: string;
  downloaded_at: string;
  ip_address?: string;
  user_agent?: string;
  assets: {
    title: string;
    file_type: string;
    category?: string;
  } | null;
  profiles?: {
    full_name?: string;
    email?: string;
  } | null;
}

const UserActivityManager: React.FC = () => {
  const [activities, setActivities] = useState<DownloadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('7');
  const [stats, setStats] = useState({
    totalDownloads: 0,
    uniqueUsers: 0,
    topAsset: null as { title: string; downloads: number } | null,
    todayDownloads: 0
  });

  useEffect(() => {
    fetchUserActivity();
  }, [filterPeriod]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      
      // Calculate date filter
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(filterPeriod));
      
      // Fetch download activities
      const { data: downloads, error } = await supabase
        .from('downloads')
        .select(`
          id,
          downloaded_at,
          ip_address,
          user_agent,
          user_id,
          assets (
            title,
            file_type,
            category
          ),
          profiles (
            full_name,
            email
          )
        `)
        .gte('downloaded_at', daysAgo.toISOString())
        .order('downloaded_at', { ascending: false });

      if (error) throw error;

      setActivities(downloads || []);

      // Calculate stats
      const totalDownloads = downloads?.length || 0;
      const uniqueUserIds = new Set(downloads?.map(d => d.user_id).filter(Boolean));
      const uniqueUsers = uniqueUserIds.size;
      
      const today = new Date().toDateString();
      const todayDownloads = downloads?.filter(d => 
        new Date(d.downloaded_at).toDateString() === today
      ).length || 0;

      // Find most downloaded asset
      const assetDownloads: { [key: string]: { title: string; count: number } } = {};
      downloads?.forEach(download => {
        if (download.assets?.title) {
          const title = download.assets.title;
          if (!assetDownloads[title]) {
            assetDownloads[title] = { title, count: 0 };
          }
          assetDownloads[title].count++;
        }
      });

      const topAsset = Object.values(assetDownloads).reduce((max, current) => 
        current.count > (max?.count || 0) ? { title: current.title, downloads: current.count } : max, 
        null as { title: string; downloads: number } | null
      );

      setStats({
        totalDownloads,
        uniqueUsers,
        topAsset,
        todayDownloads
      });

    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      activity.assets?.title?.toLowerCase().includes(searchLower) ||
      activity.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      activity.profiles?.email?.toLowerCase().includes(searchLower) ||
      activity.ip_address?.includes(searchTerm)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBrowserInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Asset', 'User', 'Email', 'IP Address', 'Browser'];
    const csvData = filteredActivities.map(activity => [
      formatDate(activity.downloaded_at),
      activity.assets?.title || 'Unknown',
      activity.profiles?.full_name || 'Anonymous',
      activity.profiles?.email || 'N/A',
      activity.ip_address || 'N/A',
      getBrowserInfo(activity.user_agent)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_activity_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Last {filterPeriod} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Downloads</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Downloads today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Asset</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold truncate">
              {stats.topAsset?.title || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.topAsset?.downloads || 0} downloads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Track and analyze user download behavior</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24h</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportToCSV} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Browser</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No activity found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {formatDate(activity.downloaded_at)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {activity.assets?.title || 'Unknown Asset'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.assets?.category?.replace('-', ' ') || 'Uncategorized'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {activity.profiles?.full_name || 'Anonymous'}
                          </div>
                          {activity.profiles?.email && (
                            <div className="text-sm text-gray-500">
                              {activity.profiles.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{activity.ip_address || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getBrowserInfo(activity.user_agent)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityManager;
