import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Award,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  FileText,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const ExamResults = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/exam_result/student/${user._id}/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    if (score >= 60) return <Minus className="w-5 h-5 text-amber-400" />;
    return <TrendingDown className="w-5 h-5 text-red-400" />;
  };

  const getGradeBadge = (score) => {
    let grade, color;
    if (score >= 90) { grade = 'A+'; color = 'bg-emerald-500'; }
    else if (score >= 80) { grade = 'A'; color = 'bg-emerald-400'; }
    else if (score >= 70) { grade = 'B'; color = 'bg-blue-400'; }
    else if (score >= 60) { grade = 'C'; color = 'bg-amber-400'; }
    else if (score >= 50) { grade = 'D'; color = 'bg-orange-400'; }
    else { grade = 'F'; color = 'bg-red-400'; }
    
    return (
      <span className={`px-3 py-1 ${color} text-white text-sm font-bold rounded-full`}>
        {grade}
      </span>
    );
  };

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
        <h1 className="text-3xl font-bold text-white mb-2">Exam Results</h1>
        <p className="text-gray-400">
          View your performance across all completed exams
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Exams</p>
              <p className="text-3xl font-bold text-white">{results.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(
                results.length ? Math.round(results.reduce((a, b) => a + (b.final_score || 0), 0) / results.length) : 0
              )}`}>
                {results.length ? Math.round(results.reduce((a, b) => a + (b.final_score || 0), 0) / results.length) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Passed Exams</p>
              <p className="text-3xl font-bold text-emerald-400">
                {results.filter(r => (r.final_score || 0) >= 50).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/50 rounded-2xl">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No results yet</h3>
          <p className="text-gray-400 mb-6">
            Complete an exam to see your results here
          </p>
          <Link
            to="/exam/my-exams"
            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
          >
            Go to My Exams
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Exam</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Grade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-white font-medium">{result.exam_title || 'Untitled Exam'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : '--'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getScoreIcon(result.final_score || 0)}
                        <span className={`ml-2 font-bold ${getScoreColor(result.final_score || 0)}`}>
                          {result.final_score || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getGradeBadge(result.final_score || 0)}
                    </td>
                    <td className="px-6 py-4">
                      {result.graded ? (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          Graded
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center w-fit">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedResult(result)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Download Certificate"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Result Details</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(selectedResult.final_score || 0)} mb-2`}>
                {selectedResult.final_score || 0}%
              </div>
              {getGradeBadge(selectedResult.final_score || 0)}
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-gray-400">Exam</span>
                <span className="text-white">{selectedResult.exam_title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-gray-400">Status</span>
                <span className={selectedResult.graded ? 'text-emerald-400' : 'text-amber-400'}>
                  {selectedResult.graded ? 'Graded' : 'Pending'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedResult(null)}
              className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
