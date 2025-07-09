import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { examService } from '../../api/ExamService';
import { useUser } from '@contexts/UserContext.jsx';
import { Volume2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

function getGradeColor(score) {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

const ExamResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('=== FETCHING EXAM RESULT ===');
        console.log('Exam ID:', id);
        console.log('User:', user);
        console.log('Location state:', location.state);
        
        // Thử lấy từ state trước (từ navigation sau khi submit)
        if (location.state && location.state.result) {
          console.log('Using result from navigation state');
          setResult(location.state.result);
          setLoading(false);
          return;
        }

        // Nếu có resultId từ state
        if (location.state && location.state.resultId) {
          console.log('Fetching result by resultId:', location.state.resultId);
          try {
            const resultData = await examService.getExamResultDetail(location.state.resultId);
            setResult(resultData);
            setLoading(false);
            return;
          } catch (err) {
            console.warn('Failed to fetch by resultId, trying history method');
          }
        }

        // Fallback: lấy từ lịch sử làm bài
        if (user?.id && id) {
          console.log('Fetching from exam history');
          const history = await examService.getExamHistory(user.id);
          console.log('Exam history received:', history);
          
          // Lọc ra các lần làm bài của đề thi này, lấy lần mới nhất
          const filtered = Array.isArray(history)
            ? history.filter(h => String(h.examId) === String(id))
            : [];
          
          console.log('Filtered results for exam', id, ':', filtered);
          
          if (filtered.length > 0) {
            const latest = filtered.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
            console.log('Latest result:', latest);
            setResult(latest);
          } else {
            setError('Không tìm thấy kết quả bài thi. Có thể bài thi chưa được lưu thành công.');
          }
        } else {
          setError('Thiếu thông tin người dùng hoặc bài thi.');
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError('Có lỗi xảy ra khi tải kết quả bài thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, user, location.state]);

  // Lấy chi tiết từng câu hỏi từ backend (nếu có)
  const details = Array.isArray(result?.answerDetails) ? result.answerDetails : [];

  // Filter functions
  const getFilteredQuestions = () => {
    switch (activeFilter) {
      case 'Correct':
        return details.filter(q => q.isCorrect);
      case 'Incorrect':
        return details.filter(q => !q.isCorrect && q.selectedAnswer);
      case 'Unanswered':
        return details.filter(q => !q.selectedAnswer);
      default:
        return details;
    }
  };

  const filteredQuestions = getFilteredQuestions();

  // Parse options từ chuỗi text
  const parseOptions = (optionString) => {
    if (!optionString) return {};
    
    const options = {};
    
    // Thử các pattern khác nhau
    const patterns = [
      /([①②③④])\s*([^①②③④]*?)(?=[①②③④]|$)/g,
      /([ABCD])\)\s*([^ABCD]*?)(?=[ABCD]\)|$)/g,
      /([1234])\)\s*([^1234]*?)(?=[1234]\)|$)/g
    ];
    
    for (const pattern of patterns) {
      const matches = [...optionString.matchAll(pattern)];
      if (matches.length > 0) {
        matches.forEach(match => {
          const key = match[1];
          const value = match[2].trim();
          if (value) {
            options[key] = value;
          }
        });
        break;
      }
    }
    
    return options;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả bài thi...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h2>
          <p className="text-red-600 mb-4">{error || 'Không có dữ liệu kết quả'}</p>
          <button 
            onClick={() => navigate(`/exam/${id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại bài thi
          </button>
        </div>
      </div>
    );
  }

  const correctCount = details.filter(d => d.isCorrect).length;
  const incorrectCount = details.filter(d => !d.isCorrect && d.selectedAnswer).length;
  const unansweredCount = details.filter(d => !d.selectedAnswer).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với điểm số */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kết quả bài thi</h1>
            <p className="text-gray-600 mb-4">
              {location.state?.examTitle || `Bài thi ID: ${id}`}
            </p>
            
            {/* Điểm số lớn */}
            <div className={`text-6xl font-bold mb-2 ${getGradeColor(result.scores)}`}>
              {Math.round(result.scores)}%
            </div>
            <p className="text-xl text-gray-600 mb-4">Điểm số của bạn</p>
            
            {/* Stats nhanh */}
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalQuestions}</div>
                <div className="text-gray-600">Tổng câu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.noCorrect}</div>
                <div className="text-gray-600">Đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{result.noIncorrect}</div>
                <div className="text-gray-600">Sai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{unansweredCount}</div>
                <div className="text-gray-600">Bỏ qua</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {details.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* Question Review Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Question Review</h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[
  {
    key: 'All',
    label: `All (${details.length})`,
    color: 'bg-sky-500'
  },
  {
    key: 'Correct',
    label: `Correct (${correctCount})`,
    color: 'bg-green-500'
  },
  {
    key: 'Incorrect',
    label: `Incorrect (${incorrectCount})`,
    color: 'bg-red-500'
  },
  {
    key: 'Unanswered',
    label: `Unanswered (${unansweredCount})`,
    color: 'bg-gray-500'
  }
].map(filter => (
  <button
    key={filter.key}
    onClick={() => setActiveFilter(filter.key)}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeFilter === filter.key
        ? `${filter.color} text-white`
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {filter.label}
  </button>
))}

                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="divide-y divide-gray-200">
              {filteredQuestions.map((item, idx) => {
                const options = parseOptions(item.questionText);
                const hasOptions = Object.keys(options).length > 0;
                
                return (
                  <div key={idx} className="p-6">
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm font-medium">
                          Câu: {idx + 1}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.isCorrect 
                            ? 'bg-green-100 text-green-600' 
                            : item.selectedAnswer 
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.isCorrect ? (
                            <CheckCircle size={16} />
                          ) : item.selectedAnswer ? (
                            <XCircle size={16} />
                          ) : (
                            <Clock size={16} />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {item.isCorrect ? 'Correct' : item.selectedAnswer ? 'Incorrect' : 'Not Answered'}
                        </span>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-6">
                      <p className="text-gray-900 leading-relaxed text-lg">
                        {hasOptions 
                          ? item.questionText.split(/[①②③④ABCD1234]\)/)[0].trim()
                          : item.questionText
                        }
                      </p>
                    </div>

                    {/* Answer Options */}
                    {hasOptions ? (
                      <div className="space-y-3">
                        {Object.entries(options).map(([optionKey, optionText]) => {
                          const isSelected = item.selectedAnswer === optionKey;
                          const isCorrect = item.correctAnswer === optionKey;
                          
                          let optionClass = "flex items-start gap-4 p-4 rounded-lg border-2 transition-all ";
                          
                          if (isCorrect) {
                            // Đáp án đúng - màu xanh
                            optionClass += "bg-green-50 border-green-300";
                          } else if (isSelected) {
                            // Đáp án sai được chọn - màu đỏ
                            optionClass += "bg-red-50 border-red-300";
                          } else {
                            // Đáp án không được chọn - màu xám
                            optionClass += "bg-gray-50 border-gray-200";
                          }
                          
                          return (
                            <div key={optionKey} className={optionClass}>
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                  isCorrect 
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : isSelected
                                    ? 'border-red-500 bg-red-500 text-white'
                                    : 'border-gray-300 bg-white text-gray-600'
                                }`}>
                                  {optionKey}
                                </div>
                                
                                {/* Checkmark icon for correct answer */}
                                {isCorrect && (
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle size={16} className="text-white fill-current" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <span className={`text-base leading-relaxed ${
                                  isCorrect ? 'text-green-800 font-medium' : 
                                  isSelected ? 'text-red-800' : 'text-gray-700'
                                }`}>
                                  {optionKey}: {optionText}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Simple text answer display */
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600">Đáp án của bạn:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.isCorrect 
                              ? 'bg-green-100 text-green-800' 
                              : item.selectedAnswer
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.selectedAnswer || 'Không trả lời'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600">Đáp án đúng:</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {item.correctAnswer}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty state when no questions match filter */}
            {filteredQuestions.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <AlertCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có câu hỏi nào
                </h3>
                <p className="text-gray-600">
                  Không tìm thấy câu hỏi nào phù hợp với bộ lọc "{activeFilter}".
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="text-center mt-8 space-y-4">
          <div className="space-x-4">
            <button 
              onClick={() => navigate(`/exam/${id}`)}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Xem lại bài thi
            </button>
            <button 
              onClick={() => navigate('/exam')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Làm bài thi khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
