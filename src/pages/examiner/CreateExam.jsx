import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExamManageAPI } from '../../services/api';
import {
  BookOpen,
  Clock,
  Calendar,
  Settings,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle,
  Circle,
  Type,
  List,
  FileText,
  ToggleLeft,
  Hash
} from 'lucide-react';

const CreateExam = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Exam details
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    start_time: '',
    end_time: '',
    code: '',
    settings: {
      shuffle_questions: false,
      shuffle_options: false,
      show_results: true,
      allow_retake: false,
      retake_limit: 1,
      passing_score: 50,
      proctoring_enabled: false,
      allow_pause: false
    }
  });

  // Questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq',
    text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    points: 1,
    explanation: ''
  });

  const handleExamChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field, value) => {
    setExamData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    handleExamChange('code', code);
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError('Question text is required');
      return;
    }

    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      type: 'mcq',
      text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      points: 1,
      explanation: ''
    });
    setError('');
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) return;
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions,
      correct_answer: prev.correct_answer >= index && prev.correct_answer > 0 
        ? prev.correct_answer - 1 
        : prev.correct_answer
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Create Exam - convert duration to duration_seconds
      const examPayload = {
        ...examData,
        duration_seconds: examData.duration * 60 // Convert minutes to seconds
      };
      delete examPayload.duration; // Remove the duration field
      
      const examResponse = await ExamManageAPI.create(examPayload);
      const { exam_id } = examResponse.data;

      // Step 2: Add Questions
      if (questions.length > 0) {
        const questionsPayload = questions.map(q => ({
          type: q.type,
          question: q.text,
          options: q.type === 'mcq' ? q.options.filter(o => o.trim()) : undefined,
          correct_answer: q.type === 'mcq' ? q.options[q.correct_answer] : undefined,
          points: q.points,
          explanation: q.explanation
        }));

        await ExamManageAPI.addQuestions(exam_id, questionsPayload);
      }

      navigate(`/examiner/exams/${exam_id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/examiner/exams')}
          className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Exam</h1>
          <p className="text-gray-400">Set up your exam details and add questions</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                step === s
                  ? 'bg-violet-500 text-white'
                  : step > s
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-gray-400'
              }`}
            >
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </button>
            {s < 3 && (
              <div className={`w-24 h-1 ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                value={examData.title}
                onChange={(e) => handleExamChange('title', e.target.value)}
                placeholder="e.g., Final Exam - Introduction to Programming"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => handleExamChange('description', e.target.value)}
                placeholder="Describe the exam content and instructions..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={examData.duration}
                  onChange={(e) => handleExamChange('duration', parseInt(e.target.value))}
                  min={1}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exam Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={examData.code}
                    onChange={(e) => handleExamChange('code', e.target.value.toUpperCase())}
                    placeholder="EXAM123"
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 py-3 bg-violet-500/20 text-violet-400 rounded-xl hover:bg-violet-500/30 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={examData.start_time}
                  onChange={(e) => handleExamChange('start_time', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={examData.end_time}
                  onChange={(e) => handleExamChange('end_time', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep(2)}
              disabled={!examData.title}
              className="px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors"
            >
              Next: Add Questions
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Questions List */}
          {questions.length > 0 && (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Added Questions ({questions.length})
              </h2>
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl"
                  >
                    <div className="flex items-center">
                      <GripVertical className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-gray-400 mr-3">Q{index + 1}</span>
                      <span className="text-white">{q.text.substring(0, 50)}...</span>
                      <span className="ml-3 px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded">
                        {q.type.toUpperCase()}
                      </span>
                      <span className="ml-2 text-gray-400 text-sm">{q.points} pts</span>
                    </div>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Question Form */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Add Question</h2>
            
            <div className="space-y-6">
              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <div className="flex gap-3">
                  {[
                    { value: 'mcq', label: 'Multiple Choice', icon: List },
                    { value: 'short_answer', label: 'Short Answer', icon: Type },
                    { value: 'essay', label: 'Essay', icon: FileText },
                    { value: 'true_false', label: 'True/False', icon: ToggleLeft }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCurrentQuestion(prev => ({ ...prev, type: value }))}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        currentQuestion.type === value
                          ? 'bg-violet-500 text-white'
                          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Question *</label>
                <textarea
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter your question..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              {/* Options for MCQ */}
              {currentQuestion.type === 'mcq' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentQuestion(prev => ({ ...prev, correct_answer: index }))}
                          className={`p-2 rounded-lg transition-colors ${
                            currentQuestion.correct_answer === index
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                          }`}
                          title="Mark as correct"
                        >
                          {currentQuestion.correct_answer === index ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                        />
                        {currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center text-violet-400 hover:text-violet-300 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {/* Points */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Points
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                    min={1}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Explanation (optional)
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.explanation}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Explain the correct answer"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
            >
              Next: Settings
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Exam Settings</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'shuffle_questions', label: 'Shuffle Questions', desc: 'Randomize question order for each student' },
                { key: 'shuffle_options', label: 'Shuffle Options', desc: 'Randomize MCQ options order' },
                { key: 'show_results', label: 'Show Results', desc: 'Students can see results after submission' },
                { key: 'allow_retake', label: 'Allow Retakes', desc: 'Students can retake the exam' },
                { key: 'proctoring_enabled', label: 'Enable Proctoring', desc: 'Monitor students during exam' },
                { key: 'allow_pause', label: 'Allow Pause', desc: 'Students can pause the exam' }
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSettingsChange(key, !examData.settings[key])}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      examData.settings[key] ? 'bg-violet-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        examData.settings[key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={examData.settings.passing_score}
                  onChange={(e) => handleSettingsChange('passing_score', parseInt(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              {examData.settings.allow_retake && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Retake Limit
                  </label>
                  <input
                    type="number"
                    value={examData.settings.retake_limit}
                    onChange={(e) => handleSettingsChange('retake_limit', parseInt(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !examData.title}
              className="px-8 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-xl font-medium transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Create Exam
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateExam;
