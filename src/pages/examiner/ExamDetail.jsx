import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI, ExamInviteAPI } from '../../services/api';
import {
  BookOpen,
  Clock,
  Users,
  FileText,
  Settings,
  Edit,
  Trash2,
  Plus,
  Mail,
  Copy,
  ExternalLink,
  CheckCircle,
  Eye,
  ArrowLeft,
  BarChart3,
  Share2,
  UserPlus,
  ChevronRight
} from 'lucide-react';

const ExamDetail = () => {
  const { examId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examiners, setExaminers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('grader');

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

const fetchExamDetails = async () => {
  try {
    setLoading(true);
    console.log('Fetching exam with ID:', examId);
    
    // Fetch exam basic info
    const examResponse = await ExamManageAPI.get(examId);
    console.log('Exam Response:', examResponse);
    setExam(examResponse.data);
    
    // Fetch questions separately
    try {
      const questionsResponse = await ExamManageAPI.getQuestions(examId);
      console.log('Questions Response:', questionsResponse.data);
      setQuestions(questionsResponse.data || []);
    } catch (err) {
      console.log('No questions yet:', err);
      setQuestions([]);
    }
    
    // Fetch examiners list
    try {
      const examinersResponse = await ExamInviteAPI.listExaminers(examId);
      setExaminers(examinersResponse.data.examiners || []);
      setInvites(examinersResponse.data.pending_invites || []);
    } catch (err) {
      console.log('No examiners yet');
      setExaminers([]);
      setInvites([]);
    }
  } catch (error) {
    console.error('Failed to fetch exam details:', error);
  } finally {
    setLoading(false);
  }
};

  /* New Handlers */
  const handleInviteExaminer = async () => {
    try {
      // Use the generic invite wrapper or specific endpoint if aligned
      await ExamInviteAPI.invite({ exam_id: examId, email: inviteEmail, role: inviteRole });
      setShowInviteModal(false);
      setInviteEmail('');
      // Refresh details to show new pending invite or examiner
      fetchExamDetails();
      alert('Invite sent!');
    } catch (error) {
      console.error('Invite failed:', error);
      alert('Failed to send invite.');
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this exam? Passwords and settings will be locked.')) return;
    try {
      await ExamManageAPI.publish(examId);
      fetchExamDetails();
      alert('Exam published successfully!');
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish exam.');
    }
  };

  const copyExamCode = () => {
    navigator.clipboard.writeText(exam?.code || '');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center"><CheckCircle className="w-4 h-4 mr-1" />Published</span>;
      case 'draft':
        return <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full flex items-center"><Clock className="w-4 h-4 mr-1" />Draft</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400">Exam not found</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start">
          <button
            onClick={() => navigate('/examiner/exams')}
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-white mr-4">{exam.title}</h1>
              {getStatusBadge(exam.status)}
            </div>
            <p className="text-gray-400">{exam.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {exam.status === 'draft' && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
            >
              Publish
            </button>
          )}
          <Link
            to={`/examiner/exams/${examId}/edit`}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Questions</p>
              <p className="text-2xl font-bold text-white">{questions.length}</p>
            </div>
            <FileText className="w-8 h-8 text-violet-400" />
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Students</p>
              <p className="text-2xl font-bold text-white">{exam.registered_count || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Duration</p>
              <p className="text-2xl font-bold text-white">{Math.floor((exam.duration_seconds || 3600) / 60)}m</p>
            </div>
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Exam Code</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-violet-400 font-mono">{exam.code}</p>
                <button onClick={copyExamCode} className="ml-2 p-1 text-gray-400 hover:text-white">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6">
        {['overview', 'questions', 'team', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab
                ? 'text-violet-400 border-b-2 border-violet-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/examiner/exams/${examId}/questions/add`}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center">
                  <Plus className="w-5 h-5 text-violet-400 mr-3" />
                  <span className="text-white">Add Questions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center justify-between w-full p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center">
                  <UserPlus className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-white">Invite Examiners</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <Link
                to={`/examiner/grading?exam=${examId}`}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-white">Grade Submissions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link
                to={`/examiner/proctoring?exam=${examId}`}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-white">Live Proctoring</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Exam Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-gray-400">Start Time</span>
                <span className="text-white">
                  {exam.start_time ? new Date(exam.start_time).toLocaleString() : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-gray-400">End Time</span>
                <span className="text-white">
                  {exam.end_time ? new Date(exam.end_time).toLocaleString() : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-gray-400">Passing Score</span>
                <span className="text-white">{exam.settings?.passing_score || 50}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-gray-400">Shuffle Questions</span>
                <span className={exam.settings?.shuffle_questions ? 'text-emerald-400' : 'text-gray-400'}>
                  {exam.settings?.shuffle_questions ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Proctoring</span>
                <span className={exam.settings?.proctoring_enabled ? 'text-emerald-400' : 'text-gray-400'}>
                  {exam.settings?.proctoring_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the tabs remain the same... */}
      {activeTab === 'questions' && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Questions ({questions.length})</h3>
            <Link
              to={`/examiner/exams/${examId}/questions/add`}
              className="flex items-center px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Link>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No questions added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  className="flex items-start justify-between p-4 bg-slate-800/30 rounded-xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded mr-2">
                        Q{index + 1}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded mr-2">
                        {q.type}
                      </span>
                      <span className="text-gray-400 text-sm">{q.points} pts</span>
                    </div>
                    <p className="text-white">{q.text}</p>
                    {q.type === 'mcq' && q.options && (
                      <div className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <p key={i} className={`text-sm ${opt === q.correct_answer ? 'text-emerald-400' : 'text-gray-400'}`}>
                            {String.fromCharCode(65 + i)}. {opt}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/examiner/exams/${examId}/questions/${q._id}/edit`)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Team Members</h3>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </button>
          </div>

          <div className="space-y-4">
            {examiners.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium">
                      {member.name?.charAt(0) || member.email?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name || member.email}</p>
                    <p className="text-gray-400 text-sm capitalize">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  member.role === 'owner' ? 'bg-amber-500/20 text-amber-400' :
                  member.role === 'co-owner' ? 'bg-violet-500/20 text-violet-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {member.role}
                </span>
              </div>
            ))}

            {invites.length > 0 && (
              <>
                <h4 className="text-gray-400 text-sm mt-6 mb-2">Pending Invites</h4>
                {invites.map((invite, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700"
                  >
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-white">{invite.email}</p>
                        <p className="text-gray-400 text-sm capitalize">{invite.role}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">
                      Pending
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Exam Settings</h3>
          <p className="text-gray-400">
            <Link to={`/examiner/exams/${examId}/settings`} className="text-violet-400 hover:text-violet-300">
              Edit settings →
            </Link>
          </p>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Invite Examiner</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="examiner@example.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="grader">Grader</option>
                  <option value="moderator">Moderator</option>
                  <option value="co-owner">Co-Owner</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteExaminer}
                disabled={!inviteEmail}
                className="flex-1 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;
