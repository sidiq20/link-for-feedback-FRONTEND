import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ExamTakeAPI } from '../../services/api';
import {
  Clock,
  MessageSquare,
  Flag,
  ArrowRight,
  ArrowLeft,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home
} from 'lucide-react';

interface Question {
  question_id: string | number;
  text: string;
  type: string;
  points: number;
  options?: string[];
  multiple?: boolean;
}

const TakeExam = () => {
  const { examId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errorData, setErrorData] = useState<any>(null);

  // --- Initialization ---

  useEffect(() => {
    if (examId) startExam();
  }, [examId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
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
      const secondsRemaining = Math.floor((expireAt.getTime() - now.getTime()) / 1000);
      setTimeRemaining(Math.max(0, secondsRemaining));
    } catch (err: any) {
      const errRes = err.response?.data;
      setError(errRes?.error || 'Failed to start exam');
      setErrorData(errRes);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic ---

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: any) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.question_id;

    if (currentQuestion.type === 'mcq' && currentQuestion.multiple) {
        setAnswers(prev => {
            const current = prev[qId] || [];
            const currentArray = Array.isArray(current) ? current : [current].filter(Boolean);
            
            let newArray;
            if (currentArray.includes(value)) {
                newArray = currentArray.filter((v: any) => v !== value);
            } else {
                newArray = [...currentArray, value];
            }
            return { ...prev, [qId]: newArray };
        });
    } else {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    }
  };

  const clearAnswer = () => {
      if (!currentQuestion) return;
      const qId = currentQuestion.question_id;
      setAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[qId];
          return newAnswers;
      });
  };

  const toggleMarkForReview = () => {
       if (!currentQuestion) return;
       const qId = currentQuestion.question_id;
       setMarkedForReview(prev => ({
           ...prev,
           [qId]: !prev[qId]
       }));
  };

  const saveAnswer = async () => {
    // Optimistic save (in background)
    if (!currentQuestion) return;
    const answer = answers[currentQuestion.question_id];
    
    // Don't save if undefined/null unless explicitly clearing? 
    // Backend expects an answer.
    if (answer === undefined) return;

    try {
      await ExamTakeAPI.saveAnswer({
        session_id: session.session_id,
        question_id: currentQuestion.question_id,
        answer: answer
      });
    } catch (err) {
      console.error('Failed to save answer silently:', err);
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

    const handleAutoSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await ExamTakeAPI.submit(session.session_id);
            navigate('/exam/results');
        } catch (err) {
            console.error("Auto submit failed", err);
            // Even if failed, we redirect or show error
             navigate('/exam/results');
        }
    };

  // --- Persistence Wrappers ---
  const STORAGE_KEY = `exam_answers_${examId}_${user?._id}`;
  const PENDING_KEY = `exam_pending_${examId}_${user?._id}`;

  useEffect(() => {
     const saved = localStorage.getItem(STORAGE_KEY);
     if (saved) {
         try { setAnswers(JSON.parse(saved)); } catch(e) {}
     }
     const pending = localStorage.getItem(PENDING_KEY);
     if (pending) setError("Network Error: Pending submission detected. Please retry.");
  }, [examId, user?._id]);

  useEffect(() => {
      if (Object.keys(answers).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      }
  }, [answers, STORAGE_KEY]);

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit?")) return;
    
    try {
        setSubmitting(true);
        await saveAnswer(); // Save last
        await ExamTakeAPI.submit(session.session_id);
        
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PENDING_KEY);
        navigate('/exam/results');
    } catch (err: any) {
        const isNetwork = !err.response || err.message === 'Network Error';
        if (isNetwork) {
             localStorage.setItem(PENDING_KEY, JSON.stringify({ session_id: session.session_id }));
             setError("Network error! Submission pending.");
        } else {
            setError(err.response?.data?.error || 'Submission failed');
        }
        setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Render ---

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
  }

  if (error && !questions.length) {
     // Error before start (e.g. not started, ended)
      const isNotStarted = error === 'Exam has not started yet';
      const isEnded = error === 'Exam has ended';
      const timeStr = errorData?.start_time ? new Date(errorData.start_time).toLocaleString() : 
                      errorData?.end_time ? new Date(errorData.end_time).toLocaleString() : '';
      
      return (
        <div className="flex items-center justify-center min-h-screen bg-background-dark p-4 font-sans">
             <div className="bg-card-dark border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isNotStarted ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
                    {isNotStarted ? <Calendar className="w-10 h-10 text-blue-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{isNotStarted ? 'Exam Has Not Started' : isEnded ? 'Exam Has Ended' : 'Error'}</h2>
                <p className="text-gray-400 mb-6">
                    {isNotStarted ? `Scheduled for: ` : isEnded ? `Closed on: ` : error}
                    {timeStr && <span className="text-white font-medium block mt-1">{timeStr}</span>}
                </p>
                <button onClick={() => navigate('/exam')} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                    <Home size={20} /> Return to Dashboard
                </button>
             </div>
        </div>
      );
  }

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans flex flex-col text-gray-900 dark:text-gray-100 transition-colors duration-300">
        
        {/* Navbar */}
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between h-16 items-center">
                     <div className="flex items-center space-x-2">
                         <div className="bg-primary text-white p-1 rounded-md">
                             <MessageSquare className="w-6 h-6" />
                         </div>
                         <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Whisper</span>
                     </div>
                     <div className="hidden md:flex flex-col items-center">
                         <h1 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Mid-Term Examination</h1>
                         <span className="text-xs text-primary font-medium">{error ? 'Network Issue' : 'Live Session'}</span>
                     </div>
                     <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span className="font-mono font-bold text-red-600 dark:text-red-400 w-16 text-center">{formatTime(timeRemaining)}</span>
                         </div>
                         <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                             {user?.name?.charAt(0) || 'U'}
                         </div>
                     </div>
                 </div>
             </div>
        </nav>

        <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 gap-6 pt-8">
             {/* Sidebar */}
             <aside className="w-full md:w-64 flex-shrink-0 order-2 md:order-1">
                 <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm sticky top-24">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-semibold text-gray-900 dark:text-white">Questions</h3>
                         <span className="text-xs text-gray-400">{answeredCount}/{questions.length} Answered</span>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-6">
                         <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                     </div>
                     
                     <div className="grid grid-cols-5 gap-2 mb-6">
                         {questions.map((q, idx) => (
                             <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-8 h-8 rounded-md text-xs font-medium transition-all relative ${
                                    idx === currentQuestionIndex 
                                        ? 'bg-white dark:bg-gray-700 border-2 border-primary text-gray-900 dark:text-white shadow-[0_0_10px_rgba(251,69,135,0.3)] font-bold'
                                        : answers[q.question_id]
                                            ? 'bg-primary text-white hover:opacity-90'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                             >
                                 {idx + 1}
                                 {markedForReview[q.question_id] && (
                                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full border border-card-dark"></span>
                                 )}
                             </button>
                         ))}
                     </div>

                     <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                         <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                             <div className="w-3 h-3 rounded bg-primary"></div>
                             <span>Answered</span>
                         </div>
                         <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                             <div className="w-3 h-3 rounded bg-yellow-500 border border-yellow-500"></div>
                             <span>Marked for Review</span>
                         </div>
                         <div className="flex items-center space-x-2 text-xs text-gray-400">
                             <div className="w-3 h-3 rounded bg-gray-800"></div>
                             <span>Not Visited</span>
                         </div>
                     </div>

                     <button 
                        onClick={toggleMarkForReview}
                        className={`w-full mt-6 py-2.5 px-4 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 ${
                            currentQuestion && markedForReview[currentQuestion.question_id]
                            ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
                    >
                         <Flag size={16} />
                         {currentQuestion && markedForReview[currentQuestion.question_id] ? 'Unmark Review' : 'Mark for Review'}
                     </button>
                 </div>
             </aside>

             {/* Question Area */}
             <section className="flex-grow order-1 md:order-2">
                 <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-lg min-h-[600px] flex flex-col relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                     
                     <div className="flex justify-between items-start mb-8 relative z-10">
                         <div>
                             <span className="text-primary font-bold tracking-wide text-sm uppercase mb-1 block">Question {currentQuestionIndex + 1}</span>
                             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                                 {currentQuestion?.text}
                             </h2>
                         </div>
                         <div className="bg-gray-100 dark:bg-gray-800 text-xs font-mono py-1 px-2 rounded border border-gray-200 dark:border-gray-700 text-gray-400 whitespace-nowrap ml-4">
                             {currentQuestion?.points} Points
                         </div>
                     </div>

                     <div className="space-y-4 flex-grow relative z-10">
                         {currentQuestion?.type === 'mcq' && currentQuestion.options?.map((option, idx) => {
                             const isMulti = currentQuestion.multiple;
                             const isSelected = isMulti 
                                ? answers[currentQuestion.question_id]?.includes(option)
                                : answers[currentQuestion.question_id] === option;
                             
                             return (
                                 <label key={idx} className="cursor-pointer group block">
                                     <input 
                                        type={isMulti ? "checkbox" : "radio"} 
                                        name={`q-${currentQuestion.question_id}`}
                                        className="peer sr-only"
                                        checked={Boolean(isSelected)}
                                        onChange={() => handleAnswerChange(option)}
                                     />
                                     <div className={`flex items-center p-4 rounded-lg border transition-all duration-200 group-hover:bg-gray-50 dark:group-hover:bg-[#202020] ${
                                         isSelected 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-primary/50'
                                     }`}>
                                         <div className={`flex-shrink-0 w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center transition-colors ${
                                             isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                                         }`}>
                                             {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                         </div>
                                         <span className="text-gray-700 dark:text-gray-300 text-base group-hover:text-gray-900 dark:group-hover:text-white">{option}</span>
                                     </div>
                                 </label>
                             );
                         })}

                         {currentQuestion?.type !== 'mcq' && (
                            <textarea 
                                className="w-full h-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Type your answer here..."
                                value={answers[currentQuestion?.question_id] || ''}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                            />
                         )}
                     </div>

                     <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800 relative z-10">
                         <button 
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50"
                         >
                             <ArrowLeft size={16} /> Previous
                         </button>
                         
                         <div className="flex gap-4 w-full sm:w-auto">
                             <button 
                                onClick={clearAnswer}
                                className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-800 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                             >
                                 Clear Answer
                             </button>
                             {currentQuestionIndex === questions.length - 1 ? (
                                 <button 
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/30 font-bold hover:bg-emerald-600 transition transform active:scale-95 flex items-center justify-center gap-2"
                                 >
                                     {submitting ? 'Submitting...' : 'Submit Exam'} <CheckCircle size={16} />
                                 </button>
                             ) : (
                                <button 
                                    onClick={handleNext}
                                    className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 font-bold hover:bg-primary-hover transition transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Next Question <ArrowRight size={16} />
                                </button>
                             )}
                         </div>
                     </div>
                 </div>

                 <div className="mt-6 flex justify-end">
                     <button onClick={handleSubmit} className="group relative px-6 py-3 bg-transparent text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition font-medium text-sm flex items-center gap-2">
                         <LogOut size={18} /> Finish Exam Early
                     </button>
                 </div>
             </section>
        </main>

        <footer className="mt-auto py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark">
             <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                 <div className="flex items-center gap-2 mb-4 md:mb-0">
                     <MessageSquare className="w-5 h-5 text-primary" />
                     <span className="font-semibold text-gray-900 dark:text-white">Whisper</span>
                 </div>
                 <p>© 2025 Whisper. All rights reserved. Secure proctoring active.</p>
             </div>
        </footer>
    </div>
  );
};

export default TakeExam;
