import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI, ExamProctoringAPI } from '../../services/api';
import {
  Eye,
  AlertTriangle,
  User,
  Clock,
  Camera,
  Monitor,
  Flag,
  Check,
  X,
  RefreshCw,
  Video,
  Mic
} from 'lucide-react';

const Proctoring = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const examIdFilter = searchParams.get('exam');

  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(examIdFilter || '');
  const [liveSessions, setLiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [incidentLogs, setIncidentLogs] = useState([]);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagDescription, setFlagDescription] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchLiveSessions();
      const interval = setInterval(fetchLiveSessions, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const response = await ExamManageAPI.list();
      setExams(response.data.exams || []);
      if (examIdFilter) {
        setSelectedExam(examIdFilter);
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveSessions = async () => {
    try {
      const response = await ExamProctoringAPI.getLiveStudents(selectedExam);
      setLiveSessions(response.data.live_sessions || []);
    } catch (error) {
      console.error('Failed to fetch live sessions:', error);
    }
  };

  const fetchSessionLogs = async (sessionId) => {
    try {
      const response = await ExamProctoringAPI.getLogs(sessionId);
      setIncidentLogs(response.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const handleFlagSession = async () => {
    if (!selectedSession || !flagDescription.trim()) return;

    try {
      await ExamProctoringAPI.flagIncident(selectedSession, flagDescription);
      setShowFlagModal(false);
      setFlagDescription('');
      fetchSessionLogs(selectedSession);
    } catch (error) {
      console.error('Failed to flag session:', error);
    }
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'tab_switch':
        return <Monitor className="w-4 h-4 text-amber-400" />;
      case 'face_not_detected':
        return <Camera className="w-4 h-4 text-red-400" />;
      case 'multiple_faces':
        return <User className="w-4 h-4 text-red-400" />;
      case 'audio_detected':
        return <Mic className="w-4 h-4 text-amber-400" />;
      case 'manual_flag':
        return <Flag className="w-4 h-4 text-violet-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'paused':
        return 'bg-amber-500';
      case 'flagged':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Proctoring</h1>
          <p className="text-gray-400">Monitor students taking exams in real-time</p>
        </div>
        {selectedExam && (
          <button
            onClick={fetchLiveSessions}
            className="flex items-center px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        )}
      </div>

      {/* Exam Selector */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => { setSelectedExam(e.target.value); setSelectedSession(null); }}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
        >
          <option value="">Select an exam...</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>{exam.title}</option>
          ))}
        </select>
      </div>

      {selectedExam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Sessions List */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Active Sessions ({liveSessions.length})
              </h2>
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                Live
              </div>
            </div>

            {liveSessions.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active sessions</p>
                <p className="text-gray-500 text-sm">Students will appear here when they start the exam</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveSessions.map((session, index) => (
                  <div
                    key={index}
                    onClick={() => { setSelectedSession(session.session_id); fetchSessionLogs(session.session_id); }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedSession === session.session_id
                        ? 'bg-violet-500/20 border-2 border-violet-500'
                        : 'bg-slate-800/30 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{session.student_name || 'Student'}</p>
                          <p className="text-gray-400 text-sm">{session.student_email}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {session.time_remaining || '--'}m left
                      </div>
                      {session.incident_count > 0 && (
                        <div className="flex items-center text-amber-400">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {session.incident_count} incidents
                        </div>
                      )}
                    </div>

                    {/* Proctoring Status */}
                    <div className="mt-3 flex gap-2">
                      <div className={`px-2 py-1 rounded text-xs flex items-center ${
                        session.camera_enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        <Camera className="w-3 h-3 mr-1" />
                        {session.camera_enabled ? 'On' : 'Off'}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs flex items-center ${
                        session.screen_sharing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        <Monitor className="w-3 h-3 mr-1" />
                        {session.screen_sharing ? 'On' : 'Off'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Incident Logs Panel */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Incident Logs</h2>
              {selectedSession && (
                <button
                  onClick={() => setShowFlagModal(true)}
                  className="flex items-center px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Flag
                </button>
              )}
            </div>

            {!selectedSession ? (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a session to view logs</p>
              </div>
            ) : incidentLogs.length === 0 ? (
              <div className="text-center py-12">
                <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-gray-400">No incidents recorded</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {incidentLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-800/30 rounded-lg"
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getIncidentIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{log.description || log.type}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Flag Session</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={flagDescription}
                onChange={(e) => setFlagDescription(e.target.value)}
                placeholder="Describe the incident..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFlagModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFlagSession}
                disabled={!flagDescription.trim()}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Flag className="w-5 h-5 mr-2" />
                Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proctoring;
