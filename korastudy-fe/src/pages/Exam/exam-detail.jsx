import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { examService } from '../../api/ExamService';
import { useUser } from '../../contexts/UserContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [exam, setExam] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch exam detail
  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching exam detail for ID:', id);
        
        // Kiểm tra xem examService có tồn tại không
        if (!examService || !examService.getExamDetail) {
          throw new Error('ExamService not available');
        }
        
        const examData = await examService.getExamDetail(id);
        console.log('Exam data received:', examData);
        
        if (!examData) {
          throw new Error('No exam data received');
        }
        
        setExam(examData);
        
      } catch (err) {
        console.error('Error fetching exam detail:', err);
        setError(err.message || 'Không thể tải thông tin bài thi. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamDetail();
    } else {
      setError('ID bài thi không hợp lệ');
      setLoading(false);
    }
  }, [id]);

  // Fetch comments - separate useEffect để không block exam detail
  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!exam) return;
        
        console.log('Fetching comments for exam:', id);
        const commentsData = await examService.getExamComments(id);
        console.log('Comments data received:', commentsData);
        setComments(commentsData || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        // Không hiển thị lỗi cho comments, chỉ log
        setComments([]);
      }
    };

    if (exam && examService.getExamComments) {
      fetchComments();
    }
  }, [exam, id]);

  // Submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      setIsSubmittingComment(true);
      
      await examService.addExamComment(id, newComment.trim(), user.id);
      
      // Refresh comments
      const updatedComments = await examService.getExamComments(id);
      setComments(updatedComments || []);
      
      setNewComment('');
      
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'Không giới hạn';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin bài thi...</p>
            <p className="mt-2 text-sm text-gray-500">ID: {id}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 8.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Exam ID: {id}</p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
              <button 
                onClick={() => navigate('/exam')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Quay lại danh sách bài thi
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No exam data
  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không tìm thấy bài thi với ID: {id}</p>
            <button 
              onClick={() => navigate('/exam')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách bài thi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug info - remove in production
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-yellow-100 rounded text-sm">
            <strong>Debug:</strong> ID={id}, Exam loaded: {exam ? 'Yes' : 'No'}
          </div>
        )} */}

        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/exam')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </button>
        </div>

        {/* Exam Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {exam.title || 'Bài thi TOEIC'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {exam.description || 'Mô tả bài thi'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {exam.durationTimes || exam.duration_times || 0}
              </div>
              <div className="text-sm text-gray-600">Thời gian (phút)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {exam.totalQuestions || exam.total_questions || 0}
              </div>
              <div className="text-sm text-gray-600">Câu hỏi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {exam.totalPart || exam.total_part || 0}
              </div>
              <div className="text-sm text-gray-600">Phần thi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {exam.level || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Cấp độ</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10H7a2 2 0 00-2 2v1a2 2 0 002 2h2m9-6V9a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h1" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sẵn sàng làm bài?</h2>
            <p className="text-gray-600">
              Thời gian: {formatDuration(exam.durationTimes)} | {exam.totalQuestions} câu hỏi
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Link
              to={`/exam/${exam.id}/test`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10H7a2 2 0 00-2 2v1a2 2 0 002 2h2m9-6V9a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h1" />
              </svg>
              Làm bài đầy đủ
            </Link>
            
            <Link
              to={`/exam/${exam.id}/practice`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Luyện tập theo phần
            </Link>
          </div>
        </div>

        {/* Exam Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chi tiết</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
              <p className="text-gray-900">
                {formatDate(exam.createdAt || exam.created_at)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Cập nhật lần cuối:</span>
              <p className="text-gray-900">
                {formatDate(exam.lastModified || exam.last_modified)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Thời gian làm bài:</span>
              <p className="text-gray-900">
                {formatDuration(exam.durationTimes || exam.duration_times)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Mức độ:</span>
              <p className="text-gray-900">{exam.level || 'Chưa xác định'}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bình luận ({comments.length})
          </h3>
          
          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Đăng nhập
                </Link> để bình luận
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có bình luận nào</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {comment.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.username || 'Người dùng'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.context}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ExamDetail;