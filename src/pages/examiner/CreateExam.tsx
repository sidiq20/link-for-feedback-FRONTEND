import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ExamManageAPI } from '../../services/api';
import {
  Info,
  List as ListIcon,
  Settings as SettingsIcon,
  CheckCircle,
  Save,
  Clock,
  Calendar,
  Plus,
  Trash2,
  GripVertical,
  Type,
  ToggleLeft,
  FileText,
  Hash,
  Copy,
  LayoutList,
  ChevronDown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface Question {
  id: number;
  type: string;
  text: string;
  options: string[];
  correct_answer: number | string;
  points: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const CreateExam = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Basic Info, 2: Questions, 3: Settings
    const [error, setError] = useState('');

    const [examData, setExamData] = useState({
        title: '',
        description: '',
        duration: 60,
        passing_score: 50,
        start_time: '',
        end_time: '',
        settings: {
            shuffle_questions: false,
            shuffle_options: false,
            show_results: true,
            allow_retake: false,
            retake_limit: 1,
            proctoring_enabled: false,
            allow_pause: false
        }
    });

    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

    // Helpers
    const handleExamChange = (field: string, value: any) => {
        setExamData(prev => ({ ...prev, [field]: value }));
    };

    const handleSettingsChange = (field: string, value: any) => {
        setExamData(prev => ({
            ...prev,
            settings: { ...prev.settings, [field]: value }
        }));
    };

    const addQuestion = () => {
        const newQ: Question = {
            id: Date.now(),
            type: 'mcq',
            text: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            points: 1,
            explanation: '',
            difficulty: 'Medium'
        };
        setQuestions([...questions, newQ]);
        setActiveQuestionIndex(questions.length); // Select the new question
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

     const removeQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        if (activeQuestionIndex === index) setActiveQuestionIndex(null);
        else if (activeQuestionIndex !== null && activeQuestionIndex > index) setActiveQuestionIndex(activeQuestionIndex - 1);
    };


    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            const examPayload = {
                ...examData,
                duration_seconds: examData.duration * 60,
            };
            // @ts-ignore
            delete examPayload.duration;

            const examResponse = await ExamManageAPI.create(examPayload);
             const { exam_id } = examResponse.data;

             if (questions.length > 0) {
                 const questionsPayload = questions.map(q => ({
                     type: q.type,
                     question: q.text,
                     options: q.type === 'mcq' ? q.options.filter(o => o.trim()) : undefined,
                     correct_answer: q.type === 'mcq' ? q.options[Number(q.correct_answer)] : q.correct_answer, // Simple mapping for now
                     points: q.points,
                     explanation: q.explanation,
                     difficulty: q.difficulty
                 }));
                 await ExamManageAPI.addQuestions(exam_id, questionsPayload);
             }
             navigate(`/examiner/exams/${exam_id}`);
        } catch (err: any) {
            console.error(err);
             setError(err.response?.data?.error || err.message || 'Failed to create exam');
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="flex flex-col h-full overflow-hidden">
        {/* Header / Stepper */}
        <div className="bg-background-dark border-b border-card-dark px-8 py-4 shrink-0">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                 <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Create New Exam</h1>
                    <p className="text-text-secondary text-sm">Design comprehensive assessments for your students.</p>
                 </div>
                 <div className="flex gap-3">
                     <button onClick={() => navigate('/examiner/exams')} className="px-4 py-2 rounded-lg border border-card-dark text-white hover:bg-card-dark transition-colors text-sm">
                         Cancel
                     </button>
                      <button 
                        onClick={handleSubmit} 
                        disabled={loading || !examData.title}
                        className="px-6 py-2 bg-examiner-primary hover:bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
                      >
                         {loading ? 'Saving...' : 'Publish Exam'}
                         <Save size={16} />
                     </button>
                 </div>
             </div>

             <div className="flex border-b border-card-dark w-full overflow-x-auto">
                {[
                    { id: 1, label: 'Basic Info', icon: Info },
                    { id: 2, label: 'Questions', icon: ListIcon },
                    { id: 3, label: 'Settings', icon: SettingsIcon },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setStep(item.id)}
                        className={`group flex items-center gap-2 px-6 pb-3 pt-2 border-b-[3px] transition-all min-w-[120px] justify-center ${step === item.id ? 'border-examiner-primary text-examiner-primary' : 'border-transparent text-text-secondary hover:text-white'}`}
                    >
                        <item.icon size={18} />
                        <span className="text-sm font-bold tracking-wide">{item.label}</span>
                    </button>
                ))}
             </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background-dark custom-scrollbar p-6">
             {error && (
                <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  {error}
                </div>
              )}

             {step === 1 && (
                 <div className="max-w-3xl mx-auto flex flex-col gap-8">
                     {/* Exam Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">Exam Title <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={examData.title}
                            onChange={(e) => handleExamChange('title', e.target.value)}
                            placeholder="e.g., Mid-Term Mathematics 101"
                            className="bg-card-dark border border-card-dark rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-examiner-primary focus:outline-none placeholder-text-secondary transition-all"
                        />
                    </div>
                    
                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-sm font-medium">Description</label>
                        <textarea 
                             value={examData.description}
                             onChange={(e) => handleExamChange('description', e.target.value)}
                            placeholder="Enter instructions or a summary..."
                            rows={5}
                            className="bg-card-dark border border-card-dark rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-examiner-primary focus:outline-none placeholder-text-secondary resize-none transition-all"
                        />
                    </div>

                    {/* Duration & Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                             <label className="text-white text-sm font-medium">Duration (minutes) <span className="text-red-500">*</span></label>
                             <div className="relative">
                                 <input 
                                    type="number"
                                    value={examData.duration}
                                    onChange={(e) => handleExamChange('duration', parseInt(e.target.value))}
                                    className="w-full bg-card-dark border border-card-dark rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-examiner-primary focus:outline-none placeholder-text-secondary transition-all"
                                />
                                <Clock className="absolute right-4 top-3.5 text-text-secondary" size={18} />
                             </div>
                        </div>
                        <div className="flex flex-col gap-2">
                             <label className="text-white text-sm font-medium">Passing Score (%)</label>
                             <div className="relative">
                                 <input 
                                     type="number"
                                     value={examData.passing_score}
                                     onChange={(e) => handleExamChange('passing_score', parseInt(e.target.value))}
                                     min="0" max="100"
                                    className="w-full bg-card-dark border border-card-dark rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-examiner-primary focus:outline-none placeholder-text-secondary transition-all"
                                />
                                <span className="absolute right-4 top-3.5 text-text-secondary font-bold">%</span>
                             </div>
                        </div>
                    </div>
                    
                     {/* Scheduling */}
                     <div className="pt-6 border-t border-card-dark">
                         <h3 className="text-lg font-bold text-white mb-4">Availability Window</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-text-secondary text-sm font-medium">Start Date & Time</label>
                                <input 
                                    type="datetime-local"
                                    value={examData.start_time}
                                    onChange={(e) => handleExamChange('start_time', e.target.value)}
                                    className="bg-card-dark border border-card-dark rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-examiner-primary focus:outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-text-secondary text-sm font-medium">End Date & Time</label>
                                <input 
                                    type="datetime-local"
                                    value={examData.end_time}
                                    onChange={(e) => handleExamChange('end_time', e.target.value)}
                                    className="bg-card-dark border border-card-dark rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-examiner-primary focus:outline-none transition-all [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                         </div>
                     </div>

                     <div className="flex justify-end pt-8">
                         <button onClick={() => setStep(2)} className="px-8 py-3 bg-examiner-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                             Next: Add Questions
                             <ArrowRight size={18} />
                         </button>
                     </div>
                 </div>
             )}

             {step === 2 && (
                 <div className="flex h-[calc(100vh-250px)] max-h-[800px] border border-card-dark rounded-xl overflow-hidden bg-[#15202b]">
                     {/* Sidebar: Question List */}
                     <div className="w-80 bg-card-dark border-r border-card-dark flex flex-col shrink-0">
                         <div className="p-4 border-b border-card-dark flex justify-between items-center bg-[#1c2a38]">
                            <h3 className="font-bold text-white">Questions</h3>
                            <button onClick={addQuestion} className="text-examiner-primary hover:bg-examiner-primary/10 p-1.5 rounded-lg transition-colors">
                                <Plus size={20} />
                            </button>
                         </div>
                         <div className="flex-1 overflow-y-auto p-3 space-y-2">
                             {questions.length === 0 && (
                                 <div className="text-center py-8 text-text-secondary text-sm">
                                     No questions yet.<br/>Click + to add one.
                                 </div>
                             )}
                             {questions.map((q, idx) => (
                                 <div 
                                    key={q.id}
                                    onClick={() => setActiveQuestionIndex(idx)}
                                    className={`group relative flex gap-3 p-3 rounded-lg cursor-pointer transition-all border ${activeQuestionIndex === idx ? 'bg-[#111a22] border-examiner-primary shadow-md' : 'bg-transparent border-transparent hover:bg-[#111a22] hover:border-card-dark'}`}
                                 >
                                     <div className="flex flex-col items-center gap-1 text-text-secondary pt-1">
                                        <span className="text-xs font-bold">{idx + 1}</span>
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <div className="flex justify-between items-start mb-1">
                                             <span className="text-[10px] uppercase font-bold text-examiner-primary bg-examiner-primary/10 px-1.5 py-0.5 rounded">{q.type}</span>
                                             <span className="text-xs text-text-secondary font-mono">{q.points}pts</span>
                                         </div>
                                         <p className="text-sm text-white truncate font-medium">{q.text || 'New Question'}</p>
                                     </div>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); removeQuestion(idx); }}
                                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-400/10 rounded"
                                      >
                                          <Trash2 size={14} />
                                      </button>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {/* Editor Area */}
                     <div className="flex-1 overflow-y-auto bg-[#111a22] p-8">
                         {activeQuestionIndex !== null && questions[activeQuestionIndex] ? (
                             <div className="max-w-3xl mx-auto">
                                 <div className="flex justify-between items-center mb-6">
                                     <h2 className="text-xl font-bold text-white">Edit Question {activeQuestionIndex + 1}</h2>
                                     <div className="flex items-center gap-2">
                                          {/* Toolbar duplicate etc can go here */}
                                     </div>
                                 </div>

                                 <div className="bg-card-dark rounded-xl border border-card-dark overflow-hidden shadow-xl">
                                     {/* Question Config */}
                                     <div className="p-6 border-b border-card-dark bg-[#1c2a38] grid grid-cols-1 md:grid-cols-3 gap-4">
                                         <div>
                                             <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Type</label>
                                             <select 
                                                value={questions[activeQuestionIndex].type}
                                                onChange={(e) => updateQuestion(activeQuestionIndex, 'type', e.target.value)}
                                                className="w-full bg-[#111a22] border border-card-dark text-white text-sm rounded-lg focus:ring-examiner-primary focus:border-examiner-primary p-2.5"
                                             >
                                                 <option value="mcq">Multiple Choice</option>
                                                 <option value="text">Short Answer</option>
                                                 <option value="essay">Essay</option>
                                                 <option value="boolean">True / False</option>
                                             </select>
                                         </div>
                                          <div>
                                             <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Points</label>
                                             <input 
                                                type="number"
                                                value={questions[activeQuestionIndex].points}
                                                onChange={(e) => updateQuestion(activeQuestionIndex, 'points', parseInt(e.target.value))}
                                                className="w-full bg-[#111a22] border border-card-dark text-white text-sm rounded-lg focus:ring-examiner-primary focus:border-examiner-primary p-2.5"
                                             />
                                         </div>
                                         <div>
                                              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Difficulty</label>
                                              <select 
                                                value={questions[activeQuestionIndex].difficulty}
                                                onChange={(e) => updateQuestion(activeQuestionIndex, 'difficulty', e.target.value)}
                                                className="w-full bg-[#111a22] border border-card-dark text-white text-sm rounded-lg focus:ring-examiner-primary focus:border-examiner-primary p-2.5"
                                             >
                                                 <option>Easy</option>
                                                 <option>Medium</option>
                                                 <option>Hard</option>
                                             </select>
                                         </div>
                                     </div>

                                     {/* Question Text */}
                                     <div className="p-6 border-b border-card-dark">
                                         <label className="block text-sm font-medium text-white mb-2">Question Text</label>
                                         <textarea 
                                             value={questions[activeQuestionIndex].text}
                                             onChange={(e) => updateQuestion(activeQuestionIndex, 'text', e.target.value)}
                                             className="w-full h-32 bg-transparent border-none text-white text-base focus:ring-0 placeholder-gray-600 resize-none p-0"
                                             placeholder="Type your question here..."
                                         />
                                     </div>

                                     {/* Options (MCQ only for now) */}
                                     {questions[activeQuestionIndex].type === 'mcq' && (
                                         <div className="p-6 bg-[#15202b]">
                                             <label className="block text-sm font-medium text-white mb-4">Answer Options</label>
                                             <div className="space-y-3">
                                                 {questions[activeQuestionIndex].options.map((opt, optIdx) => (
                                                     <div key={optIdx} className="flex items-center gap-3">
                                                         <div className="pt-2 text-text-secondary"><GripVertical size={18} /></div>
                                                         <div className="flex-1 flex items-center bg-card-dark border border-card-dark rounded-lg px-3 focus-within:border-examiner-primary transition-colors">
                                                             <button 
                                                                onClick={() => updateQuestion(activeQuestionIndex, 'correct_answer', optIdx)}
                                                                className={`mr-3 hover:text-examiner-primary ${questions[activeQuestionIndex].correct_answer === optIdx ? 'text-examiner-primary' : 'text-text-secondary'}`}
                                                             >
                                                                 {questions[activeQuestionIndex].correct_answer === optIdx ? <CheckCircle size={18} /> : <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />}
                                                             </button>
                                                             <input 
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => {
                                                                    const newOptions = [...questions[activeQuestionIndex].options];
                                                                    newOptions[optIdx] = e.target.value;
                                                                    updateQuestion(activeQuestionIndex, 'options', newOptions);
                                                                }}
                                                                placeholder={`Option ${optIdx + 1}`}
                                                                className="flex-1 bg-transparent border-none text-white focus:ring-0 h-10 py-2 text-sm"
                                                             />
                                                         </div>
                                                     </div>
                                                 ))}
                                             </div>
                                         </div>
                                     )}

                                     {/* Explanation */}
                                     <div className="p-6 border-t border-card-dark">
                                         <label className="block text-sm font-medium text-white mb-2">Explanation (Optional)</label>
                                         <textarea 
                                             value={questions[activeQuestionIndex].explanation}
                                             onChange={(e) => updateQuestion(activeQuestionIndex, 'explanation', e.target.value)}
                                             className="w-full h-20 bg-[#111a22] border border-card-dark rounded-lg text-white text-sm focus:ring-examiner-primary focus:border-examiner-primary placeholder-gray-600 p-3 resize-none"
                                             placeholder="Explain why the answer is correct..."
                                         />
                                     </div>
                                 </div>
                             </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                                 <LayoutList size={64} className="mb-4 opacity-50" />
                                 <p className="text-lg font-medium">Select a question to edit</p>
                                 <p className="text-sm">or click + to create a new one</p>
                             </div>
                         )}
                     </div>
                 </div>
             )}

             {step === 3 && (
                 <div className="max-w-3xl mx-auto space-y-6">
                     <div className="bg-card-dark border border-card-dark rounded-xl overflow-hidden p-6">
                         <h3 className="text-xl font-bold text-white mb-6">Exam Settings</h3>
                         <div className="grid grid-cols-1 gap-4">
                            {[
                                { key: 'shuffle_questions', label: 'Shuffle Questions', desc: 'Randomize the order of questions for each student.' },
                                { key: 'show_results', label: 'Show Results Immediately', desc: 'Allow students to see their score upon submission.' },
                                { key: 'allow_retake', label: 'Allow Retakes', desc: 'Enable students to take the exam multiple times.' },
                                { key: 'proctoring_enabled', label: 'Enable Proctoring', desc: 'Monitor the exam session for suspicious activity.' },
                            ].map((setting) => (
                                <div key={setting.key} className="flex items-center justify-between p-4 bg-[#111a22] rounded-xl">
                                    <div>
                                        <p className="font-bold text-white text-sm">{setting.label}</p>
                                        <p className="text-xs text-text-secondary">{setting.desc}</p>
                                    </div>
                                    <button 
                                        // @ts-ignore
                                        onClick={() => handleSettingsChange(setting.key, !examData.settings[setting.key as keyof typeof examData.settings])}
                                        // @ts-ignore
                                        className={`w-12 h-6 rounded-full relative transition-colors ${examData.settings[setting.key as keyof typeof examData.settings] ? 'bg-examiner-primary' : 'bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                            // @ts-ignore
                                            examData.settings[setting.key as keyof typeof examData.settings] ? 'left-7' : 'left-1'
                                        }`} />
                                    </button>
                                </div>
                            ))}
                         </div>
                     </div>
                     <div className="flex justify-end pt-4">
                        <button onClick={handleSubmit} className="px-8 py-3 bg-examiner-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                             Publish Exam
                             <CheckCircle size={18} />
                         </button>
                     </div>
                 </div>
             )}
        </div>
    </div>
  );
};

export default CreateExam;
