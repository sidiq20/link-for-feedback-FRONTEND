import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnalyticsAPI } from '../services/api';
import { 
  BarChart3, 
  Link as LinkIcon, 
  MessageSquare, 
  Shield,
  MessageCircle,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, trendRes] = await Promise.all([
          AnalyticsAPI.overview(),
          AnalyticsAPI.trend(30)
        ]);

        setOverview(overviewRes.data);
        setTrend(trendRes.data?.trend || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default values on error
        setOverview({
          links_count: 0,
          active_links: 0,
          feedback_count: 0,
          anonymous_links_count: 0,
          anonymous_messages_count: 0
        });
        setTrend([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>
            ))}
          </div>
          <div className="h-80 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Links',
      value: overview?.links_count || 0,
      icon: LinkIcon,
      color: 'text-whisper-accent-pink',
      bgColor: 'bg-whisper-accent-pink/10',
    },
    {
      name: 'Active Links',
      value: overview?.active_links || 0,
      icon: Eye,
      color: 'text-whisper-accent-yellow',
      bgColor: 'bg-whisper-accent-yellow/10',
    },
    {
      name: 'Total Feedback',
      value: overview?.feedback_count || 0,
      icon: MessageSquare,
      color: 'text-whisper-accent-pink',
      bgColor: 'bg-whisper-accent-pink/10',
    },
    {
      name: 'Anonymous Links',
      value: overview?.anonymous_links_count || 0,
      icon: Shield,
      color: 'text-whisper-accent-yellow',
      bgColor: 'bg-whisper-accent-yellow/10',
    },
    {
      name: 'Anonymous Messages',
      value: overview?.anonymous_messages_count || 0,
      icon: MessageCircle,
      color: 'text-whisper-accent-pink',
      bgColor: 'bg-whisper-accent-pink/10',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to your feedback management center</p>
        </div>
        <Link
          to="/links/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-whisper-accent-pink hover:bg-opacity-90 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Link
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 lg:p-6 hover:bg-slate-900/70 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-xs lg:text-sm font-medium text-gray-400">{stat.name}</p>
                  <p className="text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Trend Chart */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Feedback Trend</h2>
            <p className="text-gray-400">Last 30 days</p>
          </div>
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <TrendingUp className="w-6 h-6 text-whisper-accent-pink" />
        </div>

        {trend.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FF5C8A"
                  strokeWidth={2}
                  dot={{ fill: '#FF5C8A', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No feedback data available yet</p>
              <p className="text-sm text-gray-500 mt-1">Create your first feedback link to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/links/new"
            className="flex items-center p-4 bg-whisper-card rounded-lg hover:bg-opacity-80 transition-all duration-200 group hover:scale-105"
          >
            <Plus className="w-8 h-8 text-whisper-accent-pink mr-3" />
            <div>
              <h3 className="font-medium text-white group-hover:text-whisper-accent-pink transition-colors">
                Create New Link
              </h3>
              <p className="text-sm text-gray-400">Set up a new feedback collection link</p>
            </div>
          </Link>

          <Link
            to="/anonymous-links/new"
            className="flex items-center p-4 bg-whisper-card rounded-lg hover:bg-opacity-80 transition-all duration-200 group hover:scale-105"
          >
            <Shield className="w-8 h-8 text-whisper-accent-yellow mr-3" />
            <div>
              <h3 className="font-medium text-white group-hover:text-whisper-accent-yellow transition-colors">
                Create Anonymous Link
              </h3>
              <p className="text-sm text-gray-400">Set up anonymous message collection</p>
            </div>
          </Link>

          <Link
            to="/links"
            className="flex items-center p-4 bg-whisper-card rounded-lg hover:bg-opacity-80 transition-all duration-200 group hover:scale-105"
          >
            <LinkIcon className="w-8 h-8 text-whisper-accent-pink mr-3" />
            <div>
              <h3 className="font-medium text-white group-hover:text-whisper-accent-pink transition-colors">
                Manage Links
              </h3>
              <p className="text-sm text-gray-400">View and edit your feedback links</p>
            </div>
          </Link>

          <Link
            to="/analytics"
            className="flex items-center p-4 bg-whisper-card rounded-lg hover:bg-opacity-80 transition-all duration-200 group hover:scale-105"
          >
            <BarChart3 className="w-8 h-8 text-whisper-accent-yellow mr-3" />
            <div>
              <h3 className="font-medium text-white group-hover:text-whisper-accent-yellow transition-colors">
                View Analytics
              </h3>
              <p className="text-sm text-gray-400">Detailed insights and reports</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;