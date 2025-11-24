import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormResponseAPI, FormsAPI } from '../services/api';
import { formatDateTime } from '../utils/dateUtils';
import { ArrowLeft, Loader2, BarChart2, User, FileText, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FormResults = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [results, setResults] = useState([]);
  const [pollResults, setPollResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, [formId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!formId) {
        setError('Form ID is missing');
        return;
      }
      
      console.log('🔍 FormResults: Starting fetch for formId:', formId);
      
      // Step 1: Fetch form details
      console.log('📄 Step 1: Fetching form details...');
      const formRes = await FormsAPI.get(formId);
      console.log('✅ Form loaded:', formRes.data?.title);
      setForm(formRes.data);
      
      // Step 2: Fetch individual responses
      console.log('📄 Step 2: Fetching individual responses...');
      const resultsRes = await FormResponseAPI.list(formId);
      console.log('✅ Responses loaded:', resultsRes.data?.length || 0, 'responses');
      setResults(resultsRes.data || []);
      
      // Step 3: Fetch poll results (optional)
      console.log('📄 Step 3: Fetching poll results...');
      try {
        const pollRes = await FormResponseAPI.results(formId);
        console.log('✅ Poll results loaded:', Object.keys(pollRes.data || {}));
        setPollResults(pollRes.data || {});
      } catch (pollError) {
        console.warn('⚠️ Poll results failed (continuing):', pollError.message);
        setPollResults({});
      }
      
      console.log('🎉 FormResults: All data loaded successfully!');
    } catch (error) {
      console.error('❌ FormResults: Critical error occurred:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('Network Error:', {
          message: 'No response received',
          url: error.config?.url
        });
      } else {
        console.error('Request Setup Error:', error.message);
      }
      
      setError(`Failed to load results: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  const renderPollChart = (question, data) => {
    const chartData = Object.entries(data).map(([option, count]) => ({
      option,
      count
    }));

    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">{question}</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="option" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ option, percent }) => `${option} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Results</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                setError('');
                fetchResults();
              }}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Retry
            </button>
            <button
              onClick={() => navigate('/forms')}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/forms')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </button>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{form?.title} - Results</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {results.length} total responses
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Analytics & Insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-12 text-center">
            <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Responses Yet</h3>
            <p className="text-gray-400 mb-6">Share your form to start collecting responses.</p>
            <button
              onClick={() => navigate(`/forms/${formId}/view`)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              View & Share Form
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Individual Responses */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Individual Responses</h2>
                <button
                  onClick={() => navigate(`/forms/${formId}/analytics`)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </button>
              </div>
              <div className="grid gap-6">
                {results.map((response, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-purple-400" />
                        <span className="font-semibold text-white">Response #{index + 1}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDateTime(response.submitted_at)}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {response.answers && Object.keys(response.answers).length > 0 ? (
                        Object.entries(response.answers).map(([question, answer], idx) => (
                          <div key={idx} className="border-l-4 border-purple-500 pl-4">
                            <p className="text-gray-400 text-sm font-medium">{question}</p>
                            <p className="text-white mt-1">
                              {Array.isArray(answer) ? answer.join(', ') : (answer || 'No answer')}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 italic">
                          No answers available for this response
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default FormResults;
