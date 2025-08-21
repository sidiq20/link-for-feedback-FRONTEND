import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnonymousLinksAPI } from '../services/api';
import { ArrowLeft, Save, Shield, FileText } from 'lucide-react';

const CreateAnonymousLink = () => {
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
      const response = await AnonymousLinksAPI.create(formData);
      if (response.data) {
        navigate('/anonymous-links');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Failed to create anonymous link');
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
          onClick={() => navigate('/anonymous-links')}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Anonymous Links
        </button>
        <h1 className="text-3xl font-bold text-white">Create Anonymous Link</h1>
        <p className="text-gray-400 mt-1">Set up a new link to collect anonymous messages</p>
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
                className="block w-full px-4 py-3 pl-10 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter a name for your anonymous link"
                value={formData.name}
                onChange={handleChange}
              />
              <Shield className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
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
                className="block w-full px-4 py-3 pl-10 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe what kind of anonymous messages you're looking for..."
                value={formData.description}
                onChange={handleChange}
              />
              <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-400">
              This will be shown on the public anonymous message page
            </p>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/50">
            <h3 className="text-sm font-medium text-white mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-purple-400" />
              Anonymous Messaging Features
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Users can send completely anonymous messages</li>
              <li>• No personal information is collected or stored</li>
              <li>• IP addresses are hashed for security</li>
              <li>• Perfect for honest feedback and suggestions</li>
              <li>• Messages can be viewed and managed in your dashboard</li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/anonymous-links')}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="inline-flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Anonymous Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnonymousLink;