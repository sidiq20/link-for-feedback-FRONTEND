import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI, ExamGradingAPI } from '../../services/api';
import {
  ClipboardList,
  Search,
  CheckCircle,
  Clock,
  User,
  FileText,
  ChevronRight,
  AlertCircle,
  Save,
  MessageSquare
} from 'lucide-react';

const Grading = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examIdFilter = searchParams.get('exam');

  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(examIdFilter || '');
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grades, setGrades] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchSubmissions();
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const response = await ExamManageAPI.list();
      setExams(response.data.exams || []);
      if (examIdFilter && response.data.exams?.find(e => e._id === examIdFilter)) {
        setSelectedExam(examIdFilter);
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await ExamGradingAPI.getResults(selectedExam);
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await ExamGradingAPI.getStudentResult(selectedExam, studentId);
      setSelectedSubmission(response.data);
      // Initialize grades
      const initialGrades = {};
      response.data.answers?.forEach(a => {
        initialGrades[a.question_id] = {
          score: a.score || 0,
          comment: a.comment || ''
        };
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error('Failed to fetch student details:', error);
    }
  };

  const handleGradeChange = (questionId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const handleSaveGrades = async () => {
    try {
      setSaving(true);
      const gradesArray = Object.entries(grades).map(([question_id, data]) => ({
        question_id,
        score: data.score,
        comment: data.comment
      }));

      await ExamGradingAPI.updateStudentResult(selectedExam, selectedSubmission.student_id, { grades: gradesArray });
      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Failed to save grades:', error);
    } finally {
      setSaving(false);
    }
  };

  const triggerAutoGrade = async () => {
    try {
      await ExamGradingAPI.triggerGrading(selectedExam);
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to trigger grading:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Grading</h1>
        <p className="text-gray-400">Grade student submissions and provide feedback</p>
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

      {selectedExam && (
        <>
          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-400">
              {submissions.length} submissions found
            </div>
            <button
              onClick={triggerAutoGrade}
              className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors"
            >
              Auto-Grade MCQs
            </button>
          </div>

          {/* Submissions List */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Submitted</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Score</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {submissions.map((sub, index) => (
                      <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{sub.student_name || sub.student_id}</p>
                              <p className="text-gray-400 text-sm">{sub.student_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : '--'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-lg font-bold ${
                            (sub.final_score || 0) >= 70 ? 'text-emerald-400' :
                            (sub.final_score || 0) >= 50 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {sub.final_score ?? '--'}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {sub.graded ? (
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center w-fit">
                              <CheckCircle className="w-3 h-3 mr-1" />
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
                          <button
                            onClick={() => fetchStudentDetails(sub.student_id)}
                            className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors text-sm"
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Grade Submission</h3>
                <p className="text-gray-400">{selectedSubmission.student_name || 'Student'}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedSubmission.answers?.map((answer, index) => (
                <div key={index} className="bg-slate-800/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded mr-2">
                        Q{index + 1}
                      </span>
                      <span className="text-gray-400 text-sm">{answer.points} pts max</span>
                    </div>
                    <input
                      type="number"
                      value={grades[answer.question_id]?.score ?? 0}
                      onChange={(e) => handleGradeChange(answer.question_id, 'score', parseInt(e.target.value) || 0)}
                      min={0}
                      max={answer.points}
                      className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <p className="text-white mb-2">{answer.question_text}</p>
                  <div className="bg-slate-800 rounded-lg p-3 mb-3">
                    <p className="text-gray-400 text-sm mb-1">Student's Answer:</p>
                    <p className="text-white">{answer.student_answer || 'No answer'}</p>
                  </div>
                  {answer.correct_answer && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-3">
                      <p className="text-emerald-400 text-sm mb-1">Correct Answer:</p>
                      <p className="text-white">{answer.correct_answer}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-gray-400 text-sm flex items-center mb-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Feedback
                    </label>
                    <textarea
                      value={grades[answer.question_id]?.comment ?? ''}
                      onChange={(e) => handleGradeChange(answer.question_id, 'comment', e.target.value)}
                      placeholder="Add feedback for the student..."
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrades}
                disabled={saving}
                className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Grades
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grading;
