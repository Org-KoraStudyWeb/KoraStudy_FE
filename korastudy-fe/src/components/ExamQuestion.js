import React, { useState } from 'react';
import { Volume2, CheckCircle, XCircle, Eye, Flag, FlagOff } from 'lucide-react';

const ExamQuestion = ({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect, 
  isPreview = false, 
  isTest = false,
  isFlagged = false,
  onToggleFlag
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    if (isTest && onAnswerSelect) {
      onAnswerSelect(optionIndex);
    } else if (!isPreview) {
      // For practice mode
      onAnswerSelect && onAnswerSelect(optionIndex);
    }
  };

  const getOptionClass = (optionIndex) => {
    if (!isPreview && !isTest && selectedAnswer !== null) {
      if (optionIndex === question.correctAnswer) {
        return 'border-green-500 bg-green-50 text-green-800';
      } else if (optionIndex === selectedAnswer && optionIndex !== question.correctAnswer) {
        return 'border-red-500 bg-red-50 text-red-800';
      }
    }
    
    if (selectedAnswer === optionIndex) {
      return 'border-primary-500 bg-primary-50';
    }
    
    return 'border-gray-200 hover:border-gray-300';
  };

  const getOptionNumber = (index) => {
    return ['1', '2', '3', '4'][index] || (index + 1);
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            문제 {questionNumber}
          </span>
          {question.type === 'listening' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
              <Volume2 size={14} />
              듣기
            </span>
          )}
          {question.type === 'reading' && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              읽기
            </span>
          )}
        </div>
        
        {/* Flag button for test mode */}
        {isTest && onToggleFlag && (
          <button
            onClick={onToggleFlag}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              isFlagged 
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isFlagged ? "Remove flag" : "Flag question"}
          >
            {isFlagged ? <Flag size={18} className="fill-current" /> : <FlagOff size={18} />}
          </button>
        )}
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {/* Instruction */}
        {question.instruction && (
          <p className="text-sm text-gray-600 italic">{question.instruction}</p>
        )}
        
        {/* Main Question */}
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
          <p className="text-gray-800 font-medium text-lg leading-relaxed">
            {question.question}
          </p>
        </div>
        
        {/* Passage for reading questions */}
        {question.passage && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-800 leading-relaxed text-lg">
              {question.passage}
            </p>
          </div>
        )}

        {/* Listening instruction */}
        {question.type === 'listening' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              🎧 Please use the audio controls above to listen to the audio for this question.
            </p>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={isPreview}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${getOptionClass(index)} ${
              isPreview ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-lg font-bold flex-shrink-0 mt-1">
                {getOptionNumber(index)}
              </span>
              <span className="flex-1 text-lg leading-relaxed">{option}</span>
              
              {/* Show correct/incorrect icons when answered (practice mode) */}
              {!isPreview && !isTest && selectedAnswer !== null && (
                <>
                  {index === question.correctAnswer && (
                    <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                  )}
                  {index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle size={24} className="text-red-500 flex-shrink-0" />
                  )}
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Preview Mode Info */}
      {isPreview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Eye size={16} />
            <span className="text-sm font-medium">
              미리보기 모드 - 정답은 {getOptionNumber(question.correctAnswer)} 입니다
            </span>
          </div>
        </div>
      )}

      {/* Explanation (only in practice mode after answering) */}
      {(showExplanation || isPreview) && question.explanation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">해설:</h4>
          <p className="text-yellow-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Show Explanation Button (practice mode only) */}
      {!isPreview && !isTest && selectedAnswer !== null && !showExplanation && question.explanation && (
        <button
          onClick={() => setShowExplanation(true)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
        >
          해설 보기
        </button>
      )}
    </div>
  );
};

export default ExamQuestion;
