import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamManageAPI } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

const AddQuestion = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq',
    text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    points: 1,
    explanation: ''
  });

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({...prev, options: newOptions }));
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
      correct_answer: prev.correct_answer >= index ? Math.max(0, prev.correct_answer - 1) : prev.correct_answer
    }));
  };

  const addQuestionToList = () => {
    if (!currentQuestion.text.trim()) {
      alert('Please enter a question');
      return;
    }

    if (currentQuestion.type === 'mcq' && currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill all options');
      return;
    }

    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      type: 'mcq',
      text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      points: 1,
      explanation: ''
    });
  };

  const removeQuestionFromList = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      await ExamManageAPI.addQuestions(examId, questions);
      navigate(`/examiner/exams/${examId}`);
    } catch (error) {
      console.error('Failed to add questions:', error);
      alert('Failed to add questions');
    }
  };

  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(`/examiner/exams/${examId}`)}
          className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Add Questions</h1>
          <p className="text-gray-400">Create and add questions to your exam</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Question Form */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">New Question</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Question Type</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => handleQuestionChange('type', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Question Text</label>
              <textarea
                value={currentQuestion.text}
                onChange={(e) => handleQuestionChange('text', e.target.value)}
                rows="4"
                placeholder="Enter your question here..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            {currentQuestion.type === 'mcq' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={currentQuestion.correct_answer === index}
                        onChange={() => handleQuestionChange('correct_answer', index)}
                        className="mt-3"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                      />
                      {currentQuestion.options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addOption}
                    className="text-violet-400 hover:text-violet-300 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </button>
                </div>
              </div>
            )}

            {currentQuestion.type === 'true_false' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
                <select
                  value={currentQuestion.correct_answer}
                  onChange={(e) => handleQuestionChange('correct_answer', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Points</label>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Explanation (Optional)</label>
              <textarea
                value={currentQuestion.explanation}
                onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                rows="3"
                placeholder="Explain the correct answer..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={addQuestionToList}
              className="w-full py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Exam
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Questions ({questions.length})</h2>
            {questions.length > 0 && (
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save All
              </button>
            )}
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No questions added yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {questions.map((q, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 text-xs rounded">
                        Q{index + 1}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {q.type}
                      </span>
                      <span className="text-gray-400 text-sm">{q.points} pts</span>
                    </div>
                    <button
                      onClick={() => removeQuestionFromList(index)}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white mb-2">{q.text}</p>
                  {q.type === 'mcq' && (
                    <div className="space-y-1">
                      {q.options.map((opt, i) => (
                        <p key={i} className={`text-sm ${i === q.correct_answer ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
