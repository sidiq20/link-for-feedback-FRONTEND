import React from 'react';

const QuestionRenderer = ({ question, answer, onChange, disabled = false }) => {
  const handleChange = (value) => {
    onChange(question.text, value);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 transition-colors"
            placeholder="Enter your answer..."
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={answer || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 transition-colors"
            placeholder="Enter a number..."
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={answer || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 transition-colors"
          />
        );

      case 'radio':
      case 'poll':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.text}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 focus:ring-purple-500 disabled:opacity-50"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(answer) ? answer.includes(option) : false}
                  onChange={(e) => {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    if (e.target.checked) {
                      handleChange([...currentAnswers, option]);
                    } else {
                      handleChange(currentAnswers.filter(a => a !== option));
                    }
                  }}
                  disabled={disabled}
                  className="w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-500 disabled:opacity-50"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 transition-colors"
            placeholder="Enter your answer..."
          />
        );
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-white font-medium">
        {question.text}
        {question.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

export default QuestionRenderer;