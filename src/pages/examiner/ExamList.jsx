import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI } from '../../services/api';
import {
  BookOpen,
  PlusCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  Settings,
  ChevronRight
} from 'lucide-react';

const ExamList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await ExamManageAPI.list();
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) return;
    
    try {
      await ExamManageAPI.delete(examId);
      setExams(exams.filter(e => e._id !== examId));
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  const handleCloneExam = async (examId) => {
    try {
      const response = await ExamManageAPI.clone(examId);
      fetchExams(); // Refresh list
      navigate(`/examiner/exams/${response.data.new_exam_id}`);
    } catch (error) {
      console.error('Failed to clone exam:', error);
    }
  };

  const handlePublish = async (examId) => {
    try {
      await ExamManageAPI.publish(examId);
      fetchExams();
    } catch (error) {
      console.error('Failed to publish exam:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Published</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" />Draft</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Closed</span>;
      default:
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">{status}</span>;
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && exam.status === filter;
  });

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
          <h1 className="text-3xl font-bold text-white mb-2">My Exams</h1>
          <p className="text-gray-400">Manage all your created exams</p>
        </div>
        <Link
          to="/examiner/exams/new"
          className="flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Exam
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'draft', 'published', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No exams found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'Try a different search term' : 'Create your first exam to get started'}
          </p>
          <Link
            to="/examiner/exams/new"
            className="inline-flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Exam
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam._id}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 relative"
            >
              {/* Menu */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setActiveMenu(activeMenu === exam._id ? null : exam._id)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {activeMenu === exam._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10">
                    <button
                      onClick={() => { navigate(`/examiner/exams/${exam._id}`); setActiveMenu(null); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => { navigate(`/examiner/exams/${exam._id}/edit`); setActiveMenu(null); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => { handleCloneExam(exam._id); setActiveMenu(null); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Clone
                    </button>
                    <button
                      onClick={() => { navigate(`/examiner/exams/${exam._id}/settings`); setActiveMenu(null); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={() => { handleDeleteExam(exam._id); setActiveMenu(null); }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                    {exam.title}
                  </h3>
                  {getStatusBadge(exam.status)}
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {exam.description || 'No description'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-400">
                  <FileText className="w-4 h-4 mr-2" />
                  {exam.question_count || 0} questions
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {exam.registered_count || 0} students
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {exam.duration || 60} mins
                </div>
                <div className="flex items-center text-gray-400">
                  Code: <span className="ml-1 font-mono text-violet-400">{exam.code}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/examiner/exams/${exam._id}`)}
                  className="flex-1 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                {exam.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(exam._id)}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
