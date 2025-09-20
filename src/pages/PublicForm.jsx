import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormLinksAPI, FormResponseAPI } from '../services/api';
import QuestionRenderer from '../components/forms/QuestionRenderer';
import { Loader2, CheckCircle2, FileText, Send } from 'lucide-react';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const response = await FormLinksAPI.bySlug(slug);
      setForm(response.data.form);
    } catch (error) {
      console.error('Failed to fetch form:', error);
      setError('Failed to load form.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (question, value) => {
    setAnswers({
      ...answers,
      [question]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Transform answers to match backend expected format
      const formattedAnswers = {};
      Object.entries(answers).forEach(([question, answer], idx) => {
        formattedAnswers[idx + 1] = answer
      });

      FormResponseAPI.submit(slug, { answers: formattedAnswers });
      
      console.log('Submitting form response:', { answers: formattedAnswers });
      await FormResponseAPI.submit(slug, { answers: formattedAnswers });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit form:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message === 'Network Error') {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } finally {
      setSubmitting(false);
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-md w-full p-8">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-gray-400">Your response has been submitted successfully.</p>
          </div>
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
          <p className="text-gray-400">{error || 'The form you are looking for does not exist or has expired.'}</p>
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

      <div className="relative z-10 max-w-3xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">{form.title}</h1>
          </div>
          {form.description && (
            <p className="text-gray-400 text-lg">{form.description}</p>
          )}
        </div>

        {/* Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {form.questions?.map((question, index) => (
              <div key={index} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <QuestionRenderer
                      question={question}
                      answer={answers[question.text] || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {submitting ? 'Submitting Response...' : 'Submit Response'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;
