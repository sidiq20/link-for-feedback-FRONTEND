import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://link-for-feedback--sidiqolasode5695-bddci582.leapcell.dev';

const Analytics = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const examIdFilter = searchParams.get('exam');

  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(examIdFilter || '');
  const [analytics, setAnalytics] = useState(null);
  const [itemAnalysis, setItemAnalysis] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchAnalytics();
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/exam_manage/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setExams(data.exams || []);
        if (examIdFilter) {
          setSelectedExam(examIdFilter);
        }
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics
      const analyticsRes = await fetch(`${API_BASE}/api/exam_grade/${selectedExam}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }

      // Fetch item analysis
      const itemRes = await fetch(`${API_BASE}/api/exam_grade/${selectedExam}/item_analysis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (itemRes.ok) {
        const data = await itemRes.json();
        setItemAnalysis(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtext && <p className="text-gray-500 text-sm mt-1">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const getDifficultyColor = (rate) => {
    if (rate >= 0.7) return 'text-emerald-400 bg-emerald-400';
    if (rate >= 0.4) return 'text-amber-400 bg-amber-400';
    return 'text-red-400 bg-red-400';
  };

  if (loading && exams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">View performance metrics and question analysis</p>
      </div>

      {/* Exam Selector */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
        >
          <option value="">Select an exam...</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>{exam.title}</option>
          ))}
        </select>
      </div>

      {selectedExam && analytics && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Submissions"
              value={analytics.total_submissions || 0}
              color="text-violet-400"
            />
            <StatCard
              icon={TrendingUp}
              label="Average Score"
              value={`${Math.round(analytics.average_score || 0)}%`}
              color="text-emerald-400"
            />
            <StatCard
              icon={Award}
              label="Highest Score"
              value={`${analytics.max_score || 0}%`}
              color="text-blue-400"
            />
            <StatCard
              icon={TrendingDown}
              label="Lowest Score"
              value={`${analytics.min_score || 0}%`}
              color="text-amber-400"
            />
          </div>

          {/* Score Distribution */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Score Distribution</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {[
                { range: '0-20', count: analytics.score_distribution?.['0-20'] || 0 },
                { range: '21-40', count: analytics.score_distribution?.['21-40'] || 0 },
                { range: '41-60', count: analytics.score_distribution?.['41-60'] || 0 },
                { range: '61-80', count: analytics.score_distribution?.['61-80'] || 0 },
                { range: '81-100', count: analytics.score_distribution?.['81-100'] || 0 }
              ].map((bucket, index) => {
                const maxCount = Math.max(
                  analytics.score_distribution?.['0-20'] || 0,
                  analytics.score_distribution?.['21-40'] || 0,
                  analytics.score_distribution?.['41-60'] || 0,
                  analytics.score_distribution?.['61-80'] || 0,
                  analytics.score_distribution?.['81-100'] || 0
                );
                const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                const colors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <span className="text-white text-sm mb-2">{bucket.count}</span>
                    <div
                      className={`w-full ${colors[index]} rounded-t-lg transition-all duration-500`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-gray-400 text-xs mt-2">{bucket.range}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Item Analysis */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Question Analysis</h2>
            
            {itemAnalysis.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No question data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Question</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Attempts</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Success Rate</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {itemAnalysis.map((item, index) => {
                      const successRate = item.correct_count && item.attempt_count 
                        ? (item.correct_count / item.attempt_count) * 100 
                        : 0;
                      const difficultyClass = getDifficultyColor(successRate / 100);
                      
                      return (
                        <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded mr-2">
                                Q{index + 1}
                              </span>
                              <span className="text-white truncate max-w-xs">
                                {item.question_text?.substring(0, 50)}...
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 capitalize">
                            {item.type || 'mcq'}
                          </td>
                          <td className="px-4 py-3 text-white">
                            {item.attempt_count || 0}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-slate-700 rounded-full mr-2 overflow-hidden">
                                <div
                                  className={`h-full ${difficultyClass.split(' ')[1]} transition-all`}
                                  style={{ width: `${successRate}%` }}
                                />
                              </div>
                              <span className={difficultyClass.split(' ')[0]}>
                                {Math.round(successRate)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              successRate >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                              successRate >= 40 ? 'bg-amber-500/20 text-amber-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {successRate >= 70 ? 'Easy' : successRate >= 40 ? 'Medium' : 'Hard'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
