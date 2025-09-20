import React, { useState, useEffect } from 'react';
import { FormLinksAPI } from '../../services/api';
import { 
  X, 
  Copy, 
  ExternalLink, 
  Share2, 
  Calendar,
  CheckCircle,
  Loader2
} from 'lucide-react';

const ShareModal = ({ form, isOpen, onClose }) => {
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(7);

  useEffect(() => {
    if (isOpen && form) {
      generateShareLink();
    }
  }, [isOpen, form]);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await FormLinksAPI.create(form._id, { expires_in_days: expiresIn });
      const slug = response.data.slug;
      const fullUrl = `${window.location.origin}/p/${slug}`;
      setShareLink(fullUrl);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openInNewTab = () => {
    window.open(shareLink, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Share Form</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{form?.title}</h3>
            <p className="text-gray-400 text-sm">{form?.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Link expires in (days)
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>

          <button
            onClick={generateShareLink}
            disabled={loading}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Generate Share Link'
            )}
          </button>

          {shareLink && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copy link"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={openInNewTab}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                Expires in {expiresIn} days
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;