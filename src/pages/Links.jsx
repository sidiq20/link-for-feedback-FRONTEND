import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FeedbackLinksAPI } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  MessageSquare
} from 'lucide-react';

const Links = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: ""});
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async (page = 1) => {
    try {
      setError('');
      const response = await FeedbackLinksAPI.list({ page, per_page: 10 });
      setLinks(response.data.links || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Failed to fetch links:', error);
      setError('Failed to load links. Please try again.');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setEditForm({ name: link.name, description: link.description || "" });
  }

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await FeedbackLinksAPI.update(editingLink._id, editForm);
      setEditingLink(null);
      fetchLinks();
    } catch (err) {
      console.error("Failed to save edit", err)
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const handleDelete = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await FeedbackLinksAPI.delete(linkId);
        fetchLinks();
      } catch (error) {
        console.error('Failed to delete link:', error);
        setError('Failed to delete link. Please try again.');
      }
    }
  };

  const toggleLinkStatus = async (linkId, currentStatus) => {
    try {
      await FeedbackLinksAPI.update(linkId, { is_active: !currentStatus });
      fetchLinks();
    } catch (error) {
      console.error('Failed to toggle link status:', error);
      setError('Failed to update link status. Please try again.');
    }
  };

  const filteredLinks = links.filter(link =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Feedback Links</h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">Manage your feedback collection links</p>
        </div>
        <Link
          to="/links/new"
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 bg-whisper-accent-pink hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Link
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search links..."
          className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-whisper-border rounded-lg bg-whisper-card placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-whisper-accent-pink focus:border-whisper-accent-pink transition-colors text-sm sm:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No links found</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first feedback link to get started'}
            </p>
            {!searchTerm && (
              <Link
                to="/links/new"
                className="inline-flex items-center px-4 py-2.5 sm:py-2 bg-whisper-accent-pink hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Link
              </Link>
            )}
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div
              key={link._id}
              className="bg-whisper-card backdrop-blur-xl border border-whisper-border rounded-xl overflow-hidden hover:bg-opacity-80 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                {/* Clickable main area - goes to feedback messages */}
                <Link 
                  to={`/feedback?link=${link._id}`}
                  className="flex-1 p-4 sm:p-6 hover:bg-slate-800/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate mb-1 sm:mb-0">{link.name}</h3>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                        link.is_active
                          ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                          : 'bg-red-900/30 text-red-400 border border-red-700/50'
                      }`}
                    >
                      {link.is_active ? (
                        <>
                          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                  
                  {link.description && (
                    <p className="text-gray-400 mb-3 text-sm line-clamp-2">{link.description}</p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="truncate">{formatDate(link.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="font-mono text-xs truncate">/f/{link.slug}</span>
                    </div>
                  </div>
                </Link>

                {/* Action buttons */}
                <div className="flex sm:flex-col lg:flex-row items-center justify-end sm:justify-center lg:justify-end space-x-1 sm:space-x-0 sm:space-y-1 lg:space-y-0 lg:space-x-1 p-3 sm:pt-0 lg:pt-3 border-t sm:border-t-0 lg:border-t-0 border-gray-700 sm:border-none lg:border-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLinkStatus(link._id, link.is_active);
                    }}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      link.is_active
                        ? 'text-green-400 hover:bg-green-900/20'
                        : 'text-red-400 hover:bg-red-900/20'
                    }`}
                    title={link.is_active ? 'Deactivate link' : 'Activate link'}
                  >
                    {link.is_active ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(link);
                    }}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit link"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <a
                    href={`/f/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View public page"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(link._id);
                    }}
                    className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <div className="flex items-center text-sm text-gray-400">
            Showing page {pagination.page} of {pagination.pages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchLinks(pagination.page - 1)}
              disabled={!pagination.has_prev}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => fetchLinks(pagination.page + 1)}
              disabled={!pagination.has_next}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Edit Link</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingLink(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving || !editForm.name.trim()}
                className="px-4 py-2 bg-whisper-accent-pink text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Links;