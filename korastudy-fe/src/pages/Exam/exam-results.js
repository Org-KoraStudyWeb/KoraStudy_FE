import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Award, 
  BarChart3, 
  BookOpen, 
  Volume2,
  ArrowLeft,
  Download,
  Share2,
  RotateCcw
} from 'lucide-react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const ExamResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Get data from exam submission
  const { answers, totalQuestions, examData } = location.state || {};

  // Calculate results
  const calculateResults = () => {
    if (!answers || !examData) return null;

    let correctCount = 0;
    let incorrectCount = 0;
    const correctQuestions = [];
    const incorrectQuestions = [];
    const unansweredQuestions = [];

    examData.questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      if (userAnswer === undefined) {
        unansweredQuestions.push(question);
      } else if (userAnswer === question.correctAnswer) {
        correctCount++;
        correctQuestions.push({
          ...question,
          userAnswer,
          isCorrect: true
        });
      } else {
        incorrectCount++;
        incorrectQuestions.push({
          ...question,
          userAnswer,
          isCorrect: false
        });
      }
    });

    const totalAnswered = correctCount + incorrectCount;
    const percentage = totalAnswered > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // TOPIK scoring (approximate)
    let level = 'Not Passed';
    let grade = 'F';
    
    if (percentage >= 80) {
      level = 'Level 2';
      grade = 'A';
    } else if (percentage >= 60) {
      level = 'Level 1';
      grade = 'B';
    } else if (percentage >= 40) {
      level = 'Pre-Level 1';
      grade = 'C';
    }

    return {
      correctCount,
      incorrectCount,
      unansweredCount: unansweredQuestions.length,
      totalAnswered,
      percentage,
      level,
      grade,
      correctQuestions,
      incorrectQuestions,
      unansweredQuestions
    };
  };

  const results = calculateResults();

  // Get part-wise results
  const getPartResults = () => {
    if (!results || !examData) return [];

    return examData.parts.map(part => {
      const partQuestions = examData.questions.filter(q => q.part === part.id);
      const partCorrect = results.correctQuestions.filter(q => q.part === part.id).length;
      const partIncorrect = results.incorrectQuestions.filter(q => q.part === part.id).length;
      const partUnanswered = results.unansweredQuestions.filter(q => q.part === part.id).length;
      const partPercentage = partQuestions.length > 0 ? Math.round((partCorrect / partQuestions.length) * 100) : 0;

      return {
        ...part,
        totalQuestions: partQuestions.length,
        correct: partCorrect,
        incorrect: partIncorrect,
        unanswered: partUnanswered,
        percentage: partPercentage
      };
    });
  };

  const partResults = getPartResults();

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getFilteredQuestions = () => {
    if (!results) return [];
    
    switch (selectedFilter) {
      case 'correct':
        return results.correctQuestions;
      case 'incorrect':
        return results.incorrectQuestions;
      case 'unanswered':
        return results.unansweredQuestions.map(q => ({ ...q, userAnswer: undefined, isCorrect: false }));
      default:
        return [
          ...results.correctQuestions,
          ...results.incorrectQuestions,
          ...results.unansweredQuestions.map(q => ({ ...q, userAnswer: undefined, isCorrect: false }))
        ].sort((a, b) => a.id - b.id);
    }
  };

  const getOptionNumber = (index) => {
    return ['①', '②', '③', '④'][index] || (index + 1);
  };

  if (!results || !examData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Results Found</h2>
          <Link to="/de-thi" className="text-primary-500 hover:underline">
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/de-thi" 
              className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Back to Exams
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {examData.title} - Results
            </h1>
            <p className="text-gray-600">Test completed successfully</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Results Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          
          {/* Score Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${results.percentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{results.percentage}%</span>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${getGradeColor(results.grade)}`}>
                <Award size={20} />
                {results.grade} Grade
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-gray-800">{results.level}</div>
                <div className="text-sm text-gray-600">TOPIK Level</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{results.correctCount}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((results.correctCount / totalQuestions) * 100)}% of total
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{results.incorrectCount}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((results.incorrectCount / totalQuestions) * 100)}% of total
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">{results.unansweredCount}</div>
                  <div className="text-sm text-gray-600">Unanswered</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((results.unansweredCount / totalQuestions) * 100)}% of total
              </div>
            </div>
          </div>
        </div>

        {/* Part-wise Results */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 size={24} />
              Part-wise Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {partResults.map(part => (
                <div key={part.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{part.title}</h3>
                    <span className="text-lg font-bold text-primary-600">{part.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${part.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{part.correct}</div>
                      <div className="text-gray-500">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{part.incorrect}</div>
                      <div className="text-gray-500">Wrong</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-600">{part.unanswered}</div>
                      <div className="text-gray-500">Skipped</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen size={24} />
                Question Review
              </h2>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {[
                  { id: 'all', name: 'All', count: totalQuestions },
                  { id: 'correct', name: 'Correct', count: results.correctCount },
                  { id: 'incorrect', name: 'Incorrect', count: results.incorrectCount },
                  { id: 'unanswered', name: 'Unanswered', count: results.unansweredCount }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      selectedFilter === filter.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.name} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {getFilteredQuestions().map((question, index) => (
                <div key={question.id} className="border rounded-lg p-6">
                  
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        문제 {question.id}
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
                    
                    {/* Result Status */}
                    <div className="flex items-center gap-2">
                      {question.userAnswer !== undefined ? (
                        question.isCorrect ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={20} />
                            <span className="font-medium">Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle size={20} />
                            <span className="font-medium">Incorrect</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock size={20} />
                          <span className="font-medium">Not Answered</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 font-medium mb-3 text-lg">{question.question}</p>
                    
                    {question.passage && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                        <p className="text-gray-800 leading-relaxed">{question.passage}</p>
                      </div>
                    )}
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = question.userAnswer === optionIndex;
                      const isCorrectAnswer = question.correctAnswer === optionIndex;
                      
                      let optionClass = 'border-gray-200 bg-white';
                      
                      if (isCorrectAnswer) {
                        optionClass = 'border-green-500 bg-green-50 text-green-800';
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        optionClass = 'border-red-500 bg-red-50 text-red-800';
                      }

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border-2 ${optionClass}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {getOptionNumber(optionIndex)}
                            </span>
                            <span className="flex-1">{option}</span>
                            
                            {/* Status Icons */}
                            <div className="flex items-center gap-2">
                              {isUserAnswer && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  Your Answer
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <CheckCircle size={20} className="text-green-500" />
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <XCircle size={20} className="text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">해설 (Explanation):</h4>
                      <p className="text-yellow-700 leading-relaxed">{question.explanation}</p>
                    </div>
                  )}

                  {/* Performance Tip for Incorrect Answers */}
                  {question.userAnswer !== undefined && !question.isCorrect && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-red-800 mb-2">💡 Study Tip:</h4>
                      <p className="text-red-700 text-sm">
                        {question.type === 'listening' 
                          ? "Practice more listening exercises and focus on key vocabulary and sentence patterns."
                          : "Review the grammar patterns and vocabulary used in this type of question."
                        }
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/exam/${id}`}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Retake Exam
          </Link>
          
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2">
            <Download size={20} />
            Download Results
          </button>
          
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2">
            <Share2 size={20} />
            Share Results
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExamResults;
