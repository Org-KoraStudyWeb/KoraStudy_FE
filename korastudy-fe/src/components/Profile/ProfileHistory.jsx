import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, BookOpen, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { examService } from '../../api/ExamService';

const ProfileHistory = ({ user, formatDate }) => {
  const [examHistory, setExamHistory] = useState([]);
  const [examDetails, setExamDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          console.log('🔍 Fetching exam history for user:', user.id);
          const history = await examService.getExamHistory(user.id);
          console.log('📊 Exam history response:', history);
          
          setExamHistory(history || []);
          
          // Fetch exam details for each exam
          const examDetailsMap = {};
          for (const exam of history || []) {
            try {
              const examDetail = await examService.getExamDetail(exam.examId);
              examDetailsMap[exam.examId] = examDetail;
            } catch (error) {
              console.error(`Error fetching exam ${exam.examId} details:`, error);
            }
          }
          setExamDetails(examDetailsMap);
        } catch (error) {
          console.error('❌ Error fetching exam history:', error);
          setExamHistory([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('⚠️ No user ID found');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 80) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const getGradeLabel = (score) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Giỏi';
    if (score >= 70) return 'Khá';
    if (score >= 60) return 'Trung bình';
    return 'Cần cải thiện';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Lịch sử làm bài thi
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi quá trình học tập và tiến bộ của bạn
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {examHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {examHistory.length}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Tổng bài thi</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {examHistory.length > 0 
                    ? (examHistory.reduce((acc, exam) => acc + exam.scores, 0) / examHistory.length).toFixed(1)
                    : 0
                  }
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Điểm trung bình</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-lg">
                <Award className="text-white" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {examHistory.length > 0 
                    ? Math.max(...examHistory.map(exam => exam.scores)).toFixed(0)
                    : 0
                  }
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Điểm cao nhất</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam History List */}
      <div className="space-y-4">
        {examHistory.length > 0 ? (
          examHistory.map((exam, index) => (
            <div
              key={exam.examId || index}
              className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side - Exam info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg mt-1">
                      <BookOpen className="text-primary-600 dark:text-primary-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {examDetails[exam.examId]?.title || `Bài thi #${exam.examId}`}
                      </h4>
                      {examDetails[exam.examId]?.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {examDetails[exam.examId].description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{exam.testDate || 'Không rõ ngày'}</span>
                        </div>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} className="text-gray-400" />
                          <span>{exam.totalQuestions || 0} câu hỏi</span>
                        </div>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-1.5">
                          <Target size={16} className="text-gray-400" />
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {exam.noCorrect || 0} đúng
                          </span>
                          <span>/</span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {exam.noIncorrect || 0} sai
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Độ chính xác</span>
                          <span className="font-medium">
                            {exam.totalQuestions > 0 
                              ? ((exam.noCorrect / exam.totalQuestions) * 100).toFixed(0)
                              : 0
                            }%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${exam.totalQuestions > 0 
                                ? (exam.noCorrect / exam.totalQuestions) * 100 
                                : 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Score */}
                <div className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl border-2 ${getScoreBgColor(exam.scores || 0)} min-w-[140px]`}>
                  <div className={`text-4xl font-bold ${getScoreColor(exam.scores || 0)}`}>
                    {(exam.scores || 0).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    điểm
                  </div>
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    exam.scores >= 90 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    exam.scores >= 80 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                    exam.scores >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {getGradeLabel(exam.scores || 0)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-dark-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-600">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 dark:bg-dark-700 rounded-full">
                <BookOpen size={48} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có lịch sử thi
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hãy bắt đầu làm bài thi đầu tiên để xem lịch sử ở đây!
            </p>
            <button
              onClick={() => window.location.href = '/exam'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <BookOpen size={20} />
              Bắt đầu làm bài thi
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHistory;