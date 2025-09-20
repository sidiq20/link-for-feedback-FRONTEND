import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormsAPI } from '../services/api';
import ShareModal from '../components/forms/ShareModal';
import QuestionRenderer from '../components/forms/QuestionRenderer';
import { 
  ArrowLeft, 
  Share2, 
  Edit, 
  BarChart3, 
  FileText,
  Calendar,
  Users,
  Loader2
} from 'lucide-react';

const ViewForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      setError('');
      if (!formId) {
        setError('Form ID is missing');
        return;
      }
      const response = await FormsAPI.get(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Failed to fetch form:', error);
      setError('Failed to load form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Form Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The form you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/forms')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/forms')}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </button>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{form.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Created {new Date(form.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {form.response_count || 0} responses
                      </div>
                    </div>
                  </div>
                </div>
                
                {form.description && (
                  <p className="text-gray-300 text-lg leading-relaxed">{form.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>

                <button
                  onClick={() => navigate(`/forms/${formId}/edit`)}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/forms/${formId}/results`)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Results
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Preview */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Form Preview</h2>
          
          {form.questions && form.questions.length > 0 ? (
            <div className="space-y-8">
              {form.questions.map((question, index) => (
                <div key={index} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <QuestionRenderer
                        question={question}
                        answer=""
                        onChange={() => {}}
                        disabled={true}
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Type: {question.type} {question.required && '• Required'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Questions Added</h3>
              <p className="text-gray-400 mb-6">Add questions to your form to see them here.</p>
              <button
                onClick={() => navigate(`/forms/${formId}/edit`)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Add Questions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        form={form}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};

export default ViewForm;