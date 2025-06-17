import React, { useState } from 'react';
import { Volume2, CheckCircle, XCircle, Info } from 'lucide-react';

const ExamQuestion = ({ question, questionNumber, showAnswer = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'listening':
        return 'Nghe hiểu';
      case 'reading':
        return 'Đọc hiểu';
      default:
        return 'Câu hỏi';
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'listening':
        return 'bg-blue-100 text-blue-800';
      case 'reading':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {questionNumber}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(question.type)}`}>
            {getQuestionTypeLabel(question.type)}
          </span>
        </div>
        
        {question.type === 'listening' && (
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300">
            <Volume2 size={16} />
            <span className="text-sm font-medium">Nghe audio</span>
          </button>
        )}
      </div>

      {/* Question Content */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">
          {question.question}
        </h3>
        
        {question.passage && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 leading-relaxed">
              {question.passage}
            </p>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-4">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isSelected = selectedAnswer === index;
          
          let optionClass = "p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ";
          
          if (showAnswer) {
            if (isCorrect) {
              optionClass += "border-green-500 bg-green-50 text-green-800";
            } else if (isSelected && !isCorrect) {
              optionClass += "border-red-500 bg-red-50 text-red-800";
            } else {
              optionClass += "border-gray-200 hover:border-gray-300";
            }
          } else {
            if (isSelected) {
              optionClass += "border-primary-500 bg-primary-50 text-primary-800";
            } else {
              optionClass += "border-gray-200 hover:border-primary-300 hover:bg-primary-50";
            }
          }

          return (
            <div
              key={index}
              onClick={() => !showAnswer && setSelectedAnswer(index)}
              className={optionClass}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0">
                  {showAnswer && isCorrect && <CheckCircle size={16} className="text-green-500" />}
                  {showAnswer && isSelected && !isCorrect && <XCircle size={16} className="text-red-500" />}
                  {!showAnswer && (
                    <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-primary-500' : ''}`}></div>
                  )}
                </div>
                <span className="font-medium text-sm">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">
                  {option}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show Answer Button */}
      {!showAnswer && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          <Info size={16} />
          <span className="text-sm font-medium">
            {showExplanation ? 'Ẩn giải thích' : 'Xem đáp án'}
          </span>
        </button>
      )}

      {/* Explanation */}
      {(showAnswer || showExplanation) && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Giải thích:</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                {question.explanation}
              </p>
              {showAnswer && (
                <p className="text-blue-700 text-sm mt-2">
                  <strong>Đáp án đúng: {String.fromCharCode(65 + question.correctAnswer)}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuestion;
