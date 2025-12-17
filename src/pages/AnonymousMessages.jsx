import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnonymousAPI } from '../services/api';
import { 
  Search, 
  Calendar,
  Trash2,
  Eye,
  Shield,
  MessageCircle
} from 'lucide-react';

const AnonymousMessages = () => {
  const [searchParams] = useSearchParams();
  const linkId = searchParams.get('link');
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (linkId) {
      fetchMessages();
    } else {
      setLoading(false);
      setError('No link ID provided');
    }
  }, [linkId]);

  const fetchMessages = async () => {
    if (!linkId) {
      setError('No link ID provided');
      setLoading(false);
      return;
    }

    try {
      setError('');
      const response = await AnonymousAPI.list(linkId);
      setMessages(response.data.messages || response.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError('Failed to load messages. Please try again.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await AnonymousAPI.delete(messageId);
        fetchMessages();
      } catch (error) {
        console.error('Failed to delete message:', error);
        setError('Failed to delete message. Please try again.');
      }
    }
  };

  const filteredMessages = messages.filter(message =>
    message.message?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Anonymous Messages</h1>
          <p className="text-gray-400 mt-1">View and manage anonymous messages from your links</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search messages..."
          className="block w-full pl-10 pr-3 py-3 border border-whisper-border rounded-lg bg-whisper-card placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-whisper-accent-yellow focus:border-whisper-accent-yellow transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No messages found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Anonymous messages will appear here once users submit through your links'}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message._id}
              className="bg-whisper-card backdrop-blur-xl border border-whisper-border rounded-xl p-4 lg:p-6 hover:bg-opacity-80 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                    <div className="w-10 h-10 bg-whisper-accent-yellow rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Anonymous Message</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm text-gray-400">
                        <span>From: {message.link_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3 line-clamp-3">{message.message}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(message.submitted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View full message"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(message._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Shield className="w-6 h-6 mr-2 text-whisper-accent-yellow" />
                Anonymous Message
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-400">From Link:</span>
                <p className="text-white mt-1">{selectedMessage.link_name}</p>
              </div>
              
              <div>
                <span className="text-gray-400">Message:</span>
                <p className="text-white mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Received on {new Date(selectedMessage.submitted_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnonymousMessages;