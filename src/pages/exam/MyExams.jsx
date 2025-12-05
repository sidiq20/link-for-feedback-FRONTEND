import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamPortalAPI } from '../../services/api';
import {
  BookOpen,
  Clock,
  Calendar,
  Play,
  FileText,
  Search,
  Filter,
  ChevronRight,
  Users,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MyExams = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, ongoing
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMyExams();
  }, []);

  const fetchMyExams = async () => {
    try {
      setLoading(true);
      const response = await ExamPortalAPI.dashboard();
      const data = response.data;
      
      // Combine registered and upcoming exams
      const allExams = [
        ...(data.registered || []).map(e => ({ ...e, status: 'registered' })),
        ...(data.upcoming || []).map(e => ({ ...e, status: 'upcoming' }))
      ];
      setExams(allExams);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (exam) => {
    const now = new Date();
    const startTime = exam.start_time ? new Date(exam.start_time) : null;
    
    if (exam.completed) {
      return (
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    }
    
    if (startTime && startTime > now) {
      return (
        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Upcoming
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center">
        <Play className="w-3 h-3 mr-1" />
        Available
      </span>
    );
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'upcoming') return matchesSearch && exam.status === 'upcoming';
    if (filter === 'completed') return matchesSearch && exam.completed;
    return matchesSearch;
  });

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
        <h1 className="text-3xl font-bold text-white mb-2">My Exams</h1>
        <p className="text-gray-400">
          View and manage all your registered exams
        </p>
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
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'upcoming', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-500 text-white'
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
            {searchQuery ? 'Try a different search term' : 'Register for exams to see them here'}
          </p>
          <Link
            to="/exam/browse"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            Browse Available Exams
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                {getStatusBadge(exam)}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {exam.title || 'Untitled Exam'}
              </h3>
              
              <div className="space-y-2 mb-4 text-sm text-gray-400">
                {exam.start_time && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(exam.start_time).toLocaleDateString()}
                  </div>
                )}
                {exam.duration && (
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-2" />
                    {exam.duration} minutes
                  </div>
                )}
                {exam.student_id && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Student ID: {exam.student_id}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => navigate(`/exam/take/${exam.exam_id}`)}
                disabled={exam.completed}
                className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center ${
                  exam.completed
                    ? 'bg-slate-800 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {exam.completed ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Exam
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExams;
