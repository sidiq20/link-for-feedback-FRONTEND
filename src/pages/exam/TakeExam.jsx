import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamTakeAPI } from '../../services/api';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  Flag,
  Save
} from 'lucide-react';

const TakeExam = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    startExam();
  }, [examId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const startExam = async () => {
    try {
      setLoading(true);
      const sessionResponse = await ExamTakeAPI.start(examId);
      setSession(sessionResponse.data);
      
      const questionsResponse = await ExamTakeAPI.getQuestions(examId);
      setQuestions(questionsResponse.data.questions || []);
      
      // Calculate time remaining
      const expireAt = new Date(sessionResponse.data.expire_at);
      const now = new Date();
      const secondsRemaining = Math.floor((expireAt - now) / 1000);
      setTimeRemaining(secondsRemaining);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.question_id]: value
    }));
  };

  const saveAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.question_id];
    
    try {
      await ExamTakeAPI.saveAnswer({
        session_id: session.session_id,
        question_id: currentQuestion.question_id,
        answer: answer
      });
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  };

  const handleNext = async () => {
    await saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit? You cannot change your answers after submission.')) return;
    
    try {
      setSubmitting(true);
      await saveAnswer(); // Save current answer
      await ExamTakeAPI.submit(session.session_id);
      navigate('/exam/results');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={() => navigate('/exam')}
            className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-violet-400" />
            <div>
              <p className="text-gray-400 text-sm">Time Remaining</p>
              <p className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">Progress</p>
            <p className="text-white font-semibold">{currentQuestionIndex + 1} / {questions.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-slate-800 rounded-full h-2">
          <div
            className="bg-violet-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm rounded-full">
                Question {currentQuestionIndex + 1}
              </span>
              <span className="ml-3 text-gray-400 text-sm">{currentQuestion?.points} points</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-6">
            {currentQuestion?.text}
          </h2>

          {/* Answer Options */}
          {currentQuestion?.type === 'mcq' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                    answers[currentQuestion.question_id] === option
                      ? 'bg-violet-500/20 border-2 border-violet-500'
                      : 'bg-slate-800/30 border-2 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.question_id}`}
                    value={option}
                    checked={answers[currentQuestion.question_id] === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="mr-4"
                  />
                  <span className="text-white">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion?.type === 'text' && (
            <textarea
              value={answers[currentQuestion.question_id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 resize-none"
            />
          )}

          {currentQuestion?.type === 'boolean' && (
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswerChange('true')}
                className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                  answers[currentQuestion.question_id] === 'true'
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-800/30 text-gray-300 hover:bg-slate-800'
                }`}
              >
                True
              </button>
              <button
                onClick={() => handleAnswerChange('false')}
                className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                  answers[currentQuestion.question_id] === 'false'
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-800/30 text-gray-300 hover:bg-slate-800'
                }`}
              >
                False
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Exam
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-violet-500 text-white'
                    : answers[q.question_id]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/30 text-gray-400 border border-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
