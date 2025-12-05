import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI } from '../../services/api';
import {
  BookOpen,
  Search,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Info
} from 'lucide-react';

const RegisterExam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [examCode, setExamCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examInfo, setExamInfo] = useState(null);

  const handleSearch = async () => {
    if (!examCode.trim()) {
      setError('Please enter an exam code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Search for exam by code
      const response = await ExamManageAPI.list();
      const exam = response.data.exams?.find(e => e.code === examCode.toUpperCase());
      
      if (exam) {
        setExamInfo(exam);
      } else {
        setError('Exam not found. Please check the code and try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search for exam');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (examInfo) {
      navigate(`/exam/take/${examInfo._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Register for Exam</h1>
          <p className="text-gray-400">Enter your exam code to get started</p>
        </div>

        {/* Search Box */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="w-5 h-5 text-violet-400" />
            <label className="text-white font-medium">Exam Code</label>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter exam code (e.g., EXAM123)"
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 font-mono text-lg focus:outline-none focus:border-violet-500"
              maxLength={10}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !examCode.trim()}
              className="px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Exam Info */}
        {examInfo && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{examInfo.title}</h2>
                <p className="text-gray-400">{examInfo.description || 'No description available'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                examInfo.status === 'published' 
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {examInfo.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Duration</p>
                <p className="text-white font-semibold">{examInfo.duration_seconds / 60 || 60} minutes</p>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Questions</p>
                <p className="text-white font-semibold">{examInfo.question_count || 0} questions</p>
              </div>
            </div>

            {examInfo.status === 'published' ? (
              <button
                onClick={handleRegister}
                className="w-full py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                Start Exam
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start">
                <Info className="w-5 h-5 text-amber-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-medium">Exam Not Available</p>
                  <p className="text-amber-400/70 text-sm mt-1">This exam is not yet published. Please check back later.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!examInfo && (
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Don't have an exam code? Contact your instructor or exam administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterExam;
