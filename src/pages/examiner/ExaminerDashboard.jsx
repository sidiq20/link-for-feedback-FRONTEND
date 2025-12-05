import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI } from '../../services/api';
import {
  BookOpen,
  Users,
  ClipboardList,
  TrendingUp,
  PlusCircle,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

const ExaminerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    publishedExams: 0,
    totalStudents: 0,
    pendingGrading: 0
  });
  const [recentExams, setRecentExams] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch exams using API service
      const response = await ExamManageAPI.list();
      const exams = response.data.exams || [];
      setRecentExams(exams.slice(0, 5));
      setStats({
        totalExams: exams.length,
        publishedExams: exams.filter(e => e.status === 'published').length,
        totalStudents: exams.reduce((sum, e) => sum + (e.registered_count || 0), 0),
        pendingGrading: exams.reduce((sum, e) => sum + (e.pending_grading || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Draft</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Closed</span>;
      default:
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Examiner Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your exams, questions, and student performance
          </p>
        </div>
        <Link
          to="/examiner/exams/new"
          className="flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Exam
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          label="Total Exams"
          value={stats.totalExams}
          color="text-violet-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Published"
          value={stats.publishedExams}
          color="text-emerald-400"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents}
          color="text-blue-400"
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Grading"
          value={stats.pendingGrading}
          color="text-amber-400"
        />
      </div>

      {/* Recent Exams & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Exams */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Exams</h2>
            <Link
              to="/examiner/exams"
              className="text-violet-400 hover:text-violet-300 text-sm flex items-center"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentExams.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No exams created yet</p>
              <Link
                to="/examiner/exams/new"
                className="mt-4 inline-flex items-center text-violet-400 hover:text-violet-300"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Create your first exam
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExams.map((exam, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/examiner/exams/${exam._id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{exam.title}</h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {exam.registered_count || 0} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(exam.status)}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/examiner/exams/new"
              className="flex items-center p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl hover:border-violet-500/40 transition-all group"
            >
              <PlusCircle className="w-5 h-5 text-violet-400 mr-3" />
              <span className="text-white">Create New Exam</span>
              <ChevronRight className="w-4 h-4 text-violet-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/examiner/grading"
              className="flex items-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:border-amber-500/40 transition-all group"
            >
              <ClipboardList className="w-5 h-5 text-amber-400 mr-3" />
              <span className="text-white">Grade Submissions</span>
              <ChevronRight className="w-4 h-4 text-amber-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/examiner/proctoring"
              className="flex items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all group"
            >
              <Eye className="w-5 h-5 text-blue-400 mr-3" />
              <span className="text-white">Live Proctoring</span>
              <ChevronRight className="w-4 h-4 text-blue-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/examiner/analytics"
              className="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all group"
            >
              <TrendingUp className="w-5 h-5 text-emerald-400 mr-3" />
              <span className="text-white">View Analytics</span>
              <ChevronRight className="w-4 h-4 text-emerald-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminerDashboard;
