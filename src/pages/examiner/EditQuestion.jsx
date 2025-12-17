import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamManageAPI } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

const EditQuestion = () => {
    const { examId, questionId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState({
        type: 'mcq',
        text: '',
        options: ['', '', '', ''],
        correct_answer: 0, 
        allow_multiple: false,
        points: 1,
        explanation: ''
    });

    useEffect(() => {
        fetchQuestion();
    }, [examId, questionId]);

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const response = await ExamManageAPI.getQuestion(examId, questionId);
            const q = response.data;
            
            // Map backend data to frontend state
            let correct = q.correct_answer;
            let allowMulti = q.allow_partial;

            // Normalize for MCQ
            if (q.type === 'mcq') {
                if (Array.isArray(q.correct_answer)) {
                    // Match options to indices
                    correct = q.correct_answer.map(ans => q.options.indexOf(ans)).filter(idx => idx !== -1);
                    allowMulti = true; 
                } else if (q.options) {
                    correct = q.options.indexOf(q.correct_answer);
                    if(correct === -1) correct = 0; // fallback
                }
            } else if (q.type === 'boolean') {
                 correct = String(q.correct_answer);
            }

            setCurrentQuestion({
                type: q.type,
                text: q.prompt || '',
                options: q.options || ['', '', '', ''],
                correct_answer: correct,
                allow_multiple: allowMulti,
                points: q.points || 1,
                explanation: q.explanation || ''
            });

        } catch (error) {
            console.error('Failed to fetch question:', error);
            alert('Failed to fetch question');
        } finally {
            setLoading(false);
        }
    };

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
            correct_answer: prev.correct_answer >= index 
                ? (Array.isArray(prev.correct_answer) ? prev.correct_answer.filter(c => c!==index) : Math.max(0, prev.correct_answer - 1)) 
                : prev.correct_answer
        }));
    };

    const handleSubmit = async () => {
        if (!currentQuestion.text.trim()) {
            alert('Please enter a question');
            return;
        }

        if (currentQuestion.type === 'mcq' && currentQuestion.options.some(opt => !opt.trim())) {
            alert('Please fill all options');
            return;
        }

        try {
            let answerKey;
            if (currentQuestion.type === 'mcq') {
                if (currentQuestion.allow_multiple && Array.isArray(currentQuestion.correct_answer)) {
                    answerKey = currentQuestion.correct_answer.map(idx => currentQuestion.options[idx]);
                } else {
                    answerKey = currentQuestion.options[currentQuestion.correct_answer];
                }
            } else {
                answerKey = currentQuestion.correct_answer;
            }

            const payload = {
                type: currentQuestion.type,
                prompt: currentQuestion.text,
                options: currentQuestion.options,
                answer_key: answerKey,
                allow_partial: currentQuestion.allow_multiple, 
                points: currentQuestion.points,
                explanation: currentQuestion.explanation
            };

            await ExamManageAPI.updateQuestion(examId, questionId, payload);
            navigate(`/examiner/exams/${examId}`);
        } catch (error) {
            console.error('Failed to update question:', error);
            alert('Failed to update question');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-white mb-2">Edit Question</h1>
                    <p className="text-gray-400">Update question details</p>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 max-w-4xl mx-auto">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Question Type</label>
                        <select
                            value={currentQuestion.type}
                            onChange={(e) => handleQuestionChange('type', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                        >
                            <option value="mcq">Multiple Choice</option>
                            <option value="boolean">True/False</option>
                            <option value="text">Short Answer</option>
                            <option value="essay">Essay</option>
                            <option value="fill_blank">Fill Blank</option>
                            <option value="math">Math</option>
                            <option value="code">Code</option>
                            <option value="match">Match</option>
                            <option value="file_upload">File Upload</option>
                            <option value="image_label">Image Label</option>
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-300">Options</label>
                                <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentQuestion.allow_multiple || false}
                                        onChange={(e) => {
                                            const isMultiple = e.target.checked;
                                            setCurrentQuestion(prev => ({
                                                ...prev,
                                                allow_multiple: isMultiple,
                                                correct_answer: isMultiple ? [] : 0
                                            }));
                                        }}
                                        className="rounded border-slate-700 bg-slate-800"
                                    />
                                    <span>Allow Multiple Answers</span>
                                </label>
                            </div>
                            <div className="space-y-2">
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type={currentQuestion.allow_multiple ? "checkbox" : "radio"}
                                            name="correct"
                                            checked={
                                                currentQuestion.allow_multiple 
                                                ? (Array.isArray(currentQuestion.correct_answer) && currentQuestion.correct_answer.includes(index))
                                                : currentQuestion.correct_answer === index
                                            }
                                            onChange={() => {
                                                if (currentQuestion.allow_multiple) {
                                                    setCurrentQuestion(prev => {
                                                        const current = Array.isArray(prev.correct_answer) ? prev.correct_answer : [];
                                                        const newAnswers = current.includes(index)
                                                            ? current.filter(i => i !== index)
                                                            : [...current, index];
                                                        return { ...prev, correct_answer: newAnswers };
                                                    });
                                                } else {
                                                    handleQuestionChange('correct_answer', index);
                                                }
                                            }}
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

                    {currentQuestion.type === 'boolean' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
                            <select
                                value={currentQuestion.correct_answer}
                                onChange={(e) => handleQuestionChange('correct_answer', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
                            >
                                <option value="">Select answer</option>
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
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate(`/examiner/exams/${examId}`)}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors ml-auto"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditQuestion;
