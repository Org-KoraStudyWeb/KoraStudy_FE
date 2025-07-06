import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, FlagOff, AlertCircle, CheckCircle } from 'lucide-react';
import { examService } from '../../api/ExamService';
import { useUser } from '@contexts/UserContext.jsx';
import { toast } from 'react-toastify';

const ExamTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  
  // State management
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set()); // Thêm state cho flagged questions
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Bạn cần đăng nhập để tham gia thi');
      navigate('/dang-nhap', { 
        state: { from: `/exam/${id}/test` } 
      });
      return;
    }
  }, [isAuthenticated, navigate, id]);

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching exam data for ID:', id);
        
        const examData = await examService.getExamDetail(id);
        console.log('✅ Exam data received:', examData);
        
        setExam(examData);
        
        // Set thời gian làm bài (chuyển từ phút sang giây)
        if (examData.durationTimes) {
          setTimeLeft(examData.durationTimes * 60);
        }
        
        // Chuyển đổi dữ liệu từ backend format sang frontend format
        const formattedQuestions = [];
        if (examData.parts && examData.parts.length > 0) {
          examData.parts.forEach(part => {
            if (part.questions && part.questions.length > 0) {
              part.questions.forEach(question => {
                formattedQuestions.push({
                  id: question.questionId,
                  partId: part.partId,
                  partNumber: part.partNumber,
                  partName: part.title,
                  questionText: question.questionText,
                  options: parseOptions(question.option), // <-- Sửa chỗ này
                  type: part.partNumber <= 2 ? 'listening' : 'reading',
                  audioUrl: question.audioUrl,
                  imageUrl: question.imageUrl,
                  correctAnswer: question.correctAnswer
                });
              });
            }
          });
        }
        
        setQuestions(formattedQuestions);
        console.log('✅ Formatted questions:', formattedQuestions);
        
      } catch (err) {
        console.error('❌ Error fetching exam data:', err);
        setError('Không thể tải dữ liệu bài thi. Vui lòng thử lại.');
        toast.error('Không thể tải dữ liệu bài thi');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          toast.warning('Hết thời gian! Tự động nộp bài.');
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format thời gian hiển thị
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Xử lý chọn đáp án
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  // Xử lý toggle flag cho câu hỏi
  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
        toast.info(`Đã bỏ đánh dấu câu ${getCurrentQuestionNumber(questionId)}`);
      } else {
        newSet.add(questionId);
        toast.success(`Đã đánh dấu câu ${getCurrentQuestionNumber(questionId)}`);
      }
      return newSet;
    });
  };

  // Helper function để lấy số thứ tự câu hỏi
  const getCurrentQuestionNumber = (questionId) => {
    const index = questions.findIndex(q => q.id === questionId);
    return index + 1;
  };

  // Chuyển câu hỏi
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestion(index);
  };

  // Nộp bài thi
  const handleSubmitExam = async () => {
    if (!user?.id) {
      toast.error('Bạn cần đăng nhập để nộp bài');
      return;
    }
    setIsSubmitting(true);
    try {
      const answers = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: q.selectedAnswer || null
      }));
      // Gọi API và nhận kết quả
      const result = await examService.submitExam(id, answers, user.id);
      toast.success('Nộp bài thành công!');
      // Điều hướng sang trang kết quả, truyền cả result, questions và answers để xem chi tiết đúng/sai
      navigate(`/exam/${id}/results`, {
        state: {
          result,
          questions,
          answers
        }
      });
    } catch (error) {
      toast.error('Nộp bài thất bại');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm submit dialog
  const ConfirmSubmitDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-medium">Xác nhận nộp bài</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài sẽ không thể chỉnh sửa.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span>Đã trả lời:</span>
              <span className="font-medium">{Object.keys(answers).length} / {questions.length}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Chưa trả lời:</span>
              <span className="font-medium">{questions.length - Object.keys(answers).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Đã đánh dấu:</span>
              <span className="font-medium">{flaggedQuestions.size}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmSubmit(false)}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              setShowConfirmSubmit(false);
              handleSubmitExam();
            }}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/de-thi')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy câu hỏi cho bài thi này</p>
          <button 
            onClick={() => navigate('/de-thi')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">{exam.title}</h1>
              <span className="text-sm text-gray-600">
                Câu {currentQuestion + 1} / {totalQuestions}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Đã làm:</span>
                <span className="text-sm font-medium">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Danh sách câu hỏi</h3>
              
              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((question, index) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isCurrent = index === currentQuestion;
                  const isFlagged = flaggedQuestions.has(question.id);
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all relative ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isAnswered
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                      
                      {/* Flag indicator */}
                      {isFlagged && (
                        <Flag 
                          size={12} 
                          className="absolute -top-1 -right-1 text-red-500 fill-current" 
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Câu hiện tại</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Chưa trả lời</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag size={14} className="text-red-500 fill-current" />
                  <span>Đã đánh dấu</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">
                  Tiến độ: {answeredCount}/{totalQuestions} câu
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                
                {/* Flagged count */}
                <div className="mt-2 text-sm text-gray-600">
                  Đã đánh dấu: {flaggedQuestions.size} câu
                </div>
              </div>
            </div>
          </div>

          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {currentQuestion + 1}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Câu {currentQuestion + 1}
                  </h3>
                </div>
                
                {/* Flag Button */}
                <button
                  onClick={() => handleToggleFlag(currentQuestionData.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestionData.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={flaggedQuestions.has(currentQuestionData.id) ? 'Bỏ đánh dấu' : 'Đánh dấu câu hỏi'}
                >
                  {flaggedQuestions.has(currentQuestionData.id) ? (
                    <Flag className="h-5 w-5 fill-current" />
                  ) : (
                    <FlagOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Question Content */}
              <div className="mb-6">
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {currentQuestionData.questionText}
                  </p>
                </div>
                
                {currentQuestionData.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={currentQuestionData.imageUrl} 
                      alt="Question illustration" 
                      className="max-w-full h-auto rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {currentQuestionData.audioUrl && (
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source src={currentQuestionData.audioUrl} type="audio/mpeg" />
                      Trình duyệt của bạn không hỗ trợ phát audio.
                    </audio>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestionData.options && currentQuestionData.options.map((opt) => (
                  <div key={opt.label} className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors
                    ${answers[currentQuestionData.id] === opt.label
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }"
                    onClick={() => handleAnswerSelect(currentQuestionData.id, opt.label)}
                  >
                    <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center text-sm font-medium ${
                      answers[currentQuestionData.id] === opt.label
                        ? 'border-blue-500 bg-blue-500 text-white' 
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestionData.id] === opt.label ? '●' : opt.label}
                    </div>
                    <span className="flex-1 text-left">
                      {opt.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Câu trước
                </button>
                
                <span className="text-sm text-gray-500">
                  {currentQuestion + 1} / {totalQuestions}
                </span>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === totalQuestions - 1}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu tiếp →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Dialog */}
      {showConfirmSubmit && <ConfirmSubmitDialog />}
    </div>
  );
};

export default ExamTest;

// Khi format dữ liệu câu hỏi từ backend, cần tách các lựa chọn (option) thành mảng để render từng đáp án A/B/C/D
// Giả sử option từ backend là chuỗi: "A) ...?B) ...?C) ...?D) ...?"
const parseOptions = (optionString) => {
  if (!optionString) return [];
  // Tách theo mẫu "A)", "B)", "C)", "D)"
  const regex = /([A-D])\)\s*([^A-D]*)/g;
  let match;
  const options = [];
  while ((match = regex.exec(optionString)) !== null) {
    options.push({
      label: match[1],
      text: match[2].trim()
    });
  }
  return options;
};