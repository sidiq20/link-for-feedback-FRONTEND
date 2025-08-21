import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnonymousLinksAPI, AnonymousAPI } from '../services/api';
import { Send, Shield, MessageCircle } from 'lucide-react';

const PublicAnonymous = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showParticipationPrompt, setShowParticipationPrompt] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinkData();
  }, [slug]);

  const fetchLinkData = async () => {
    try {
      const linkRes = await AnonymousLinksAPI.bySlug(slug);
      setLink(linkRes.data);
    } catch (error) {
      console.error('Error fetching link data:', error);
      setError(error.response?.data?.error || 'Anonymous link not found or inactive');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await AnonymousAPI.submit(slug, { message: message.trim() });
      setSubmitted(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit message');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Link Not Found</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Arc */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 lg:p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">{link?.name}</h1>
          </div>
          {link?.description && (
            <p className="text-gray-400 text-lg">{link.description}</p>
          )}
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-purple-900/30 border border-purple-700/50 rounded-full text-sm text-purple-300">
            <Shield className="w-4 h-4 mr-2" />
            Your message will be completely anonymous
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Message Form */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-8 w-full">
            {submitted ? (
              <>
                {!showParticipationPrompt ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                    <p className="text-gray-400">Your anonymous message has been delivered successfully.</p>
                    <button
                      onClick={() => setShowParticipationPrompt(true)}
                      className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Now It’s Your Turn!</h2>
                    <p className="text-gray-400 mb-4">
                      You’ve shared your thoughts anonymously — now take the next step 
                      and participate. It’s your secrets that matter too!
                    </p>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Register & Share Yours
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-purple-400" />
                  Send Anonymous Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={8}
                      className="block w-full px-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                      placeholder="Share your thoughts anonymously..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">Your identity is completely protected</p>
                      <p className="text-xs text-gray-400">{message.length}/2000</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Anonymous Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAnonymous;
