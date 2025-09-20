import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormsAPI } from '../services/api';
import { ArrowLeft, Save, FileText, Loader2, Plus, Trash2 } from 'lucide-react';

const EditForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      setError('');
      if (!formId) {
        setError('Form ID is missing');
        return;
      }
      const response = await FormsAPI.get(formId);
      setFormData(response.data || {});
    } catch (error) {
      console.error('Failed to fetch form:', error);
      setError('Failed to load form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { text: '', type: 'text', options: [] }],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await FormsAPI.update(formId, formData);
      navigate('/forms');
    } catch (error) {
      console.error('Failed to update form:', error);
      setError('Failed to update form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/3"></div>
          <div className="h-6 bg-slate-800 rounded w-2/3"></div>
          <div className="h-24 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/forms')}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </button>
        <h1 className="text-3xl font-bold text-white">Edit Form</h1>
        <p className="text-gray-400 mt-1">Update your form details and questions</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Form Title *
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                required
                className="block w-full px-4 py-3 pl-10 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter form title"
                value={formData.title}
                onChange={handleChange}
              />
              <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              placeholder="Enter a description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Questions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Questions</h3>
            <div className="space-y-4">
              {formData.questions.map((q, index) => (
                <div key={index} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                  <input
                    type="text"
                    className="block w-full px-3 py-2 mb-2 border border-slate-600 rounded bg-slate-900 text-white"
                    placeholder="Question text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  />
                  <select
                    className="block w-full px-3 py-2 mb-2 border border-slate-600 rounded bg-slate-900 text-white"
                    value={q.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="poll">Poll</option>
                    <option value="date">Date</option>
                    <option value="number">Number</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="inline-flex items-center text-red-400 hover:text-red-300 mt-2"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove Question
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </button>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/forms')}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
