import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, ChevronRight, BookOpen, Calendar, Clock } from 'lucide-react';
import courseService from '../../api/courseService';
import { useUser } from '../../contexts/UserContext';
import { formatDate } from '../../utils/formatDate';

const MyCoursesPage = () => {
  const { isAuthenticated, user } = useUser();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'in-progress', 'completed'

  // Debug log
  console.log('MyCoursesPage - isAuthenticated:', isAuthenticated, 'user:', user);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!isAuthenticated) {
          console.log('User not authenticated, skipping enrollment fetch');
          setLoading(false);
          return;
        }

        console.log('Fetching enrollments...');
        const data = await courseService.getUserEnrollments();
        console.log('Enrollments data:', data);
        setEnrollments(data || []);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isAuthenticated]);

  // Filter courses based on active filter
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in-progress') return enrollment.progress < 100;
    if (activeFilter === 'completed') return enrollment.progress === 100;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isAuthenticated ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Khóa học của tôi</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vui lòng đăng nhập để xem các khóa học bạn đã đăng ký.
          </p>
          <Link
            to="/dang-nhap"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Đăng nhập
          </Link>
        </div>
      ) : loading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Khóa học của tôi</h1>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Khóa học của tôi</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Khóa học của tôi</h1>

          {/* Filter tabs */}
          <div className="flex mb-8 border-b dark:border-gray-700">
            <button
              className={`pb-4 px-6 ${
                activeFilter === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              Tất cả ({enrollments.length})
            </button>
            <button
              className={`pb-4 px-6 ${
                activeFilter === 'in-progress'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveFilter('in-progress')}
            >
              Đang học ({enrollments.filter(e => e.progress < 100).length})
            </button>
            <button
              className={`pb-4 px-6 ${
                activeFilter === 'completed'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveFilter('completed')}
            >
              Hoàn thành ({enrollments.filter(e => e.progress === 100).length})
            </button>
          </div>

          {/* Courses list */}
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {activeFilter === 'all' ? 'Bạn chưa đăng ký khóa học nào' : 
                 activeFilter === 'in-progress' ? 'Không có khóa học đang học' :
                 'Chưa hoàn thành khóa học nào'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Khám phá các khóa học chất lượng cao để bắt đầu hành trình học tập của bạn.
              </p>
              <Link
                to="/courses"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Khám phá khóa học
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={enrollment.course?.thumbnail || '/api/placeholder/400/200'}
                      alt={enrollment.course?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                        <BarChart className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {enrollment.course?.title || 'Khóa học không tên'}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {enrollment.course?.description || 'Không có mô tả'}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Tiến độ</span>
                        <span>{enrollment.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Course stats */}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">
                        Đăng ký: {formatDate(enrollment.enrolledAt)}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {enrollment.course?.duration || 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.progress === 100
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {enrollment.progress === 100 ? 'Hoàn thành' : 'Đang học'}
                      </span>
                      
                      <Link
                        to={`/course/${enrollment.course?.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {enrollment.progress === 100 ? 'Ôn tập lại' : 'Tiếp tục học'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
