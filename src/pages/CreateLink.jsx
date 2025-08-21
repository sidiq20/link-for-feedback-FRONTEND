import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackLinksAPI } from '../services/api';
import { ArrowLeft, Save, Link as LinkIcon, FileText } from 'lucide-react';

const CreateLink = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await FeedbackLinksAPI.create(formData);
      if (response.data) {
        navigate('/links');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to create link');
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

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/links')}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Links
        </button>
        <h1 className="text-3xl font-bold text-white">Create New Feedback Link</h1>
        <p className="text-gray-400 mt-1">Set up a new link to collect feedback from your users</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Link Name *
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                required
                className="block w-full px-4 py-3 pl-10 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter a name for your feedback link"
                value={formData.name}
                onChange={handleChange}
              />
              <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-400">
              This will be used to generate a unique URL slug
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                rows={4}
                className="block w-full px-4 py-3 pl-10 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe what kind of feedback you're looking for..."
                value={formData.description}
                onChange={handleChange}
              />
              <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-400">
              This will be shown on the public feedback page
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-medium text-white mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• A unique URL will be generated for collecting feedback</li>
              <li>• Users can submit ratings and comments through this link</li>
              <li>• You'll be able to view and manage all feedback in your dashboard</li>
              <li>• The link can be shared publicly or embedded in your applications</li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/links')}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="inline-flex items-center px-6 py-2 bg-whisper-accent-pink hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLink;