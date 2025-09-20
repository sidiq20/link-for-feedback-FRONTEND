import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormsAPI } from '../services/api';
import { ArrowLeft, Save, PlusCircle, Trash2, FileText } from 'lucide-react';

const CreateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: '', type: 'text', required: false } // 🚫 no options by default
      ]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[index][field] = value;
      
      // Clear options if type is not radio/checkbox/poll
      if (field === 'type' && !['radio', 'checkbox', 'poll'].includes(value)) {
        updated[index].options = [];
      }
      
      return { ...prev, questions: updated };
    });
  };

  const addOption = (questionIndex) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[questionIndex].options = [...(updated[questionIndex].options || []), ''];
      return { ...prev, questions: updated };
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[questionIndex].options[optionIndex] = value;
      return { ...prev, questions: updated };
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[questionIndex].options.splice(optionIndex, 1);
      return { ...prev, questions: updated };
    });
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Form title is required');
      return;
    }
    
    if (formData.questions.length === 0) {
      setError('At least one question is required');
      return;
    }
    
    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (['radio', 'checkbox', 'poll'].includes(q.type) && (!q.options || q.options.length === 0)) {
        setError(`Question ${i + 1} needs at least one option`);
        return;
      }
    }
    
    setLoading(true);
    setError('');
    try {
      await FormsAPI.create(formData);
      navigate('/forms');
    } catch (error) {
      console.error('❌ Failed to create form:', error);
      setError(error.response?.data?.error || 'Failed to create form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Arc */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/forms')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </button>
          <h1 className="text-3xl font-bold text-white">Create New Form</h1>
          <p className="text-gray-400 mt-1">Build a custom form to collect responses</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Form Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Form Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  placeholder="Enter form title"
                  className="block w-full px-4 py-3 pl-10 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Form Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe what this form is for..."
                className="block w-full px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Questions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Questions</h3>
              <div className="space-y-4">
                {formData.questions.map((q, i) => (
                  <div key={i} className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-300">Question {i + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(i)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors"
                        title="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter question text"
                        className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        value={q.text}
                        onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                        required
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                          className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          value={q.type}
                          onChange={(e) => updateQuestion(i, 'type', e.target.value)}
                        >
                          <option value="text">Text Input</option>
                          <option value="number">Number Input</option>
                          <option value="date">Date Input</option>
                          <option value="radio">Single Choice (Radio)</option>
                          <option value="checkbox">Multiple Choice (Checkbox)</option>
                          <option value="poll">Poll/Vote</option>
                        </select>
                        
                        <label className="flex items-center space-x-2 text-gray-300">
                          <input
                            type="checkbox"
                            checked={q.required || false}
                            onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm">Required</span>
                        </label>
                      </div>
                      
                      {/* Options for radio, checkbox, poll */}
                      {['radio', 'checkbox', 'poll'].includes(q.type) && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">Options</label>
                          {(q.options || []).map((option, optIdx) => (
                            <div key={optIdx} className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder={`Option ${optIdx + 1}`}
                                className="flex-1 px-3 py-2 border border-slate-600 rounded bg-slate-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                value={option}
                                onChange={(e) => updateOption(i, optIdx, e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(i, optIdx)}
                                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(i)}
                            className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                          >
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addQuestion}
                className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>

            {/* Submit Button */}
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
                disabled={loading || !formData.title.trim()}
                className="inline-flex items-center px-6 py-2 bg-whisper-accent-yellow hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Creating...' : 'Create Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
