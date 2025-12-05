import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI } from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const EditExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    start_time: '',
    end_time: '',
    code: '',
    settings: {
      shuffle_questions: false,
      shuffle_options: false,
      show_results: true,
      allow_retake: false,
      retake_limit: 1,
      passing_score: 50,
      proctoring_enabled: false,
      allow_pause: false
    }
  });

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const response = await ExamManageAPI.get(examId);
      const exam = response.data;
      
      setExamData({
        title: exam.title || '',
        description: exam.description || '',
        duration: Math.floor((exam.duration_seconds || 3600) / 60),
        start_time: exam.start_time ? new Date(exam.start_time).toISOString().slice(0, 16) : '',
        end_time: exam.end_time ? new Date(exam.end_time).toISOString().slice(0, 16) : '',
        code: exam.code || '',
        settings: exam.settings || examData.settings
      });
    } catch (error) {
      console.error('Failed to fetch exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const updatePayload = {
        ...examData,
        duration_seconds: examData.duration * 60
      };
      delete updatePayload.duration;
      
      await ExamManageAPI.update(examId, updatePayload);
      navigate(`/examiner/exams/${examId}`);
    } catch (error) {
      console.error('Failed to update exam:', error);
      alert('Failed to update exam');
    } finally {
      setSaving(false);
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
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(`/examiner/exams/${examId}`)}
          className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Exam</h1>
          <p className="text-gray-400">Update exam details and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Exam Title</label>
              <input
                type="text"
                value={examData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={examData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={examData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Exam Code</label>
                <input
                  type="text"
                  value={examData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  value={examData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                <input
                  type="datetime-local"
                  value={examData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Exam Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-white font-medium">Shuffle Questions</p>
                <p className="text-gray-400 text-sm">Randomize question order for each student</p>
              </div>
              <input
                type="checkbox"
                checked={examData.settings.shuffle_questions}
                onChange={(e) => handleSettingsChange('shuffle_questions', e.target.checked)}
                className="w-5 h-5 text-violet-500 rounded focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-white font-medium">Shuffle Options</p>
                <p className="text-gray-400 text-sm">Randomize answer options for MCQ questions</p>
              </div>
              <input
                type="checkbox"
                checked={examData.settings.shuffle_options}
                onChange={(e) => handleSettingsChange('shuffle_options', e.target.checked)}
                className="w-5 h-5 text-violet-500 rounded focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-white font-medium">Show Results</p>
                <p className="text-gray-400 text-sm">Display results immediately after submission</p>
              </div>
              <input
                type="checkbox"
                checked={examData.settings.show_results}
                onChange={(e) => handleSettingsChange('show_results', e.target.checked)}
                className="w-5 h-5 text-violet-500 rounded focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-white font-medium">Allow Retake</p>
                <p className="text-gray-400 text-sm">Allow students to retake the exam</p>
              </div>
              <input
                type="checkbox"
                checked={examData.settings.allow_retake}
                onChange={(e) => handleSettingsChange('allow_retake', e.target.checked)}
                className="w-5 h-5 text-violet-500 rounded focus:ring-violet-500"
              />
            </div>

            {examData.settings.allow_retake && (
              <div className="p-4 bg-slate-800/30 rounded-xl">
                <label className="block text-sm font-medium text-gray-300 mb-2">Retake Limit</label>
                <input
                  type="number"
                  value={examData.settings.retake_limit}
                  onChange={(e) => handleSettingsChange('retake_limit', parseInt(e.target.value))}
                  min="1"
                  className="w-32 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            )}

            <div className="p-4 bg-slate-800/30 rounded-xl">
              <label className="block text-sm font-medium text-gray-300 mb-2">Passing Score (%)</label>
              <input
                type="number"
                value={examData.settings.passing_score}
                onChange={(e) => handleSettingsChange('passing_score', parseInt(e.target.value))}
                min="0"
                max="100"
                className="w-32 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-white font-medium">Enable Proctoring</p>
                <p className="text-gray-400 text-sm">Monitor students during the exam</p>
              </div>
              <input
                type="checkbox"
                checked={examData.settings.proctoring_enabled}
                onChange={(e) => handleSettingsChange('proctoring_enabled', e.target.checked)}
                className="w-5 h-5 text-violet-500 rounded focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div>
                <p className="text-white font-medium">Allow Pause</p>
                <p className="text-gray-400 text-sm">Allow students to pause and resume exam</p>
              </div>
              <input
                type="checkbox"
                checked={examData.settings.allow_pause}
                onChange={(e) => handleSettingsChange('allow_pause', e.target.checked)}
                className="w-5 h-5 text-violet-500 rounded focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(`/examiner/exams/${examId}`)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
