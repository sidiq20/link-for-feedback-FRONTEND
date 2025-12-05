import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamPortalAPI } from '../../services/api';
import {
  BookOpen,
  Clock,
  Users,
  Award,
  TrendingUp,
  Calendar,
  ChevronRight,
  Play,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const ExamDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    registeredExams: 0,
    completedExams: 0,
    avgScore: 0,
    upcomingExams: 0
  });
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await ExamPortalAPI.dashboard();
      const data = response.data;
      
      setUpcomingExams(data.upcoming || []);
      setRecentResults(data.recent_results || []);
      setStats({
        registeredExams: data.registered?.length || 0,
        completedExams: data.recent_results?.length || 0,
        avgScore: calculateAvgScore(data.recent_results),
        upcomingExams: data.upcoming?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAvgScore = (results) => {
    if (!results || results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + (r.final_score || 0), 0);
    return Math.round(total / results.length);
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400">
          Ready for your next exam? Here's your dashboard overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          label="Registered Exams"
          value={stats.registeredExams}
          color="text-emerald-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completedExams}
          color="text-blue-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Score"
          value={`${stats.avgScore}%`}
          color="text-purple-400"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming"
          value={stats.upcomingExams}
          color="text-amber-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Upcoming Exams</h2>
            <Link
              to="/exam/my-exams"
              className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {upcomingExams.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No upcoming exams scheduled</p>
              <Link
                to="/exam/browse"
                className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
              >
                Browse available exams
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingExams.slice(0, 3).map((exam, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{exam.title}</h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(exam.start_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/exam/take/${exam.exam_id}`)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Results</h2>
            <Link
              to="/exam/results"
              className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentResults.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No results yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Complete an exam to see results
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[150px]">
                        {result.exam_title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {result.graded ? 'Graded' : 'Pending'}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      result.final_score >= 70 ? 'text-emerald-400' : 
                      result.final_score >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {result.final_score || '--'}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/exam/browse"
          className="flex items-center p-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-medium">Browse Exams</p>
            <p className="text-gray-400 text-sm">Find and register for exams</p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/exam/results"
          className="flex items-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-medium">View Results</p>
            <p className="text-gray-400 text-sm">Check your exam scores</p>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/exam/certificates"
          className="flex items-center p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all group"
        >
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium">Certificates</p>
            <p className="text-gray-400 text-sm">Download your certificates</p>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-400 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ExamDashboard;
