import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormsAPI } from '../services/api';
import { ArrowLeft, Loader2, Share2, Edit, Trash2, FileText } from 'lucide-react';

const FormDetail = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, []);

  const fetchForm = async () => {
    try {
      setError('');
      const response = await FormsAPI.get(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Failed to fetch form:', error);
      setError(error.response?.data?.error || 'Failed to load form.');
    } finally {
      setLoading(false);
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

  if (error || !form) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-red-400">{error || 'Form not found.'}</p>
        <button
          onClick={() => navigate('/forms')}
          className="mt-4 inline-flex items-center text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/forms')}
        className="inline-flex items-center text-gray-400 hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Forms
      </button>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">{form.title}</h1>
        <p className="text-gray-400 mb-6">{form.description || 'No description provided.'}</p>

        <h3 className="text-lg font-semibold text-white mb-4">Questions</h3>
        <div className="space-y-4">
          {form.questions.map((q, index) => (
            <div key={index} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-white font-medium">{q.text}</p>
              <p className="text-sm text-gray-400">Type: {q.type}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4 mt-8">
          <button
            onClick={() => navigate(`/forms/${formId}/edit`)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormDetail;
