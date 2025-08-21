import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnonymousLinksAPI } from '../services/api';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Shield,
  MessageCircle
} from 'lucide-react';

const AnonymousLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setError('');
      const response = await AnonymousLinksAPI.list({ page: 1, per_page: 50 });
      setLinks(response.data.links || []);
    } catch (error) {
      console.error('Failed to fetch anonymous links:', error);
      setError('Failed to load anonymous links. Please try again.');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this anonymous link?')) {
      try {
        await AnonymousLinksAPI.delete(linkId);
        fetchLinks();
      } catch (error) {
        console.error('Failed to delete link:', error);
        setError('Failed to delete link. Please try again.');
      }
    }
  };

  const toggleLinkStatus = async (linkId, currentStatus) => {
    try {
      await AnonymousLinksAPI.update(linkId, { is_active: !currentStatus });
      fetchLinks();
    } catch (error) {
      console.error('Failed to toggle link status:', error);
      setError('Failed to update link status. Please try again.');
    }
  };

  const filteredLinks = links.filter(link =>
    link.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Anonymous Links</h1>
          <p className="text-gray-400 mt-1">Manage your anonymous message collection links</p>
        </div>
        <Link
          to="/anonymous-links/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-whisper-accent-yellow hover:bg-opacity-90 text-black rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Anonymous Link
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search anonymous links..."
          className="block w-full pl-10 pr-3 py-3 border border-whisper-border rounded-lg bg-whisper-card placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-whisper-accent-yellow focus:border-whisper-accent-yellow transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No anonymous links found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first anonymous link to get started'}
            </p>
            {!searchTerm && (
              <Link
                to="/anonymous-links/new"
                className="inline-flex items-center px-4 py-2 bg-whisper-accent-yellow hover:bg-opacity-90 text-black rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Anonymous Link
              </Link>
            )}
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div
              key={link._id}
              className="bg-whisper-card backdrop-blur-xl border border-whisper-border rounded-xl p-6 hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="w-5 h-5 text-whisper-accent-yellow" />
                    <h3 className="text-lg font-semibold text-white">{link.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          link.is_active
                            ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                            : 'bg-red-900/30 text-red-400 border border-red-700/50'
                        }`}
                      >
                        {link.is_active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {link.description && (
                    <p className="text-gray-400 mb-3">{link.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(link.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      <span className="font-mono text-xs">/a/{link.slug}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{link.submission_count || 0} messages</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleLinkStatus(link._id, link.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      link.is_active
                        ? 'text-green-400 hover:bg-green-900/20'
                        : 'text-red-400 hover:bg-red-900/20'
                    }`}
                    title={link.is_active ? 'Deactivate link' : 'Activate link'}
                  >
                    {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <a
                    href={`/a/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnonymousLinks;