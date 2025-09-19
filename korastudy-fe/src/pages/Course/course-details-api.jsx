import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  CheckCircle,
  BookOpen,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  Globe,
  BarChart
} from 'lucide-react';
import courseService from '../../api/courseService';
import { useAuth } from '../../contexts/AuthContext';
import formatDate from '../../utils/formatDate';

const CourseDetailAPI = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // API related state
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Toggle module expand/collapse
  const toggleModule = (moduleId) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        
        // Increment view count when viewing course details
        await courseService.incrementViewCount(courseId);
        
        // Get course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // Get course sections
        const sectionsData = await courseService.getSectionsByCourseId(courseId);
        setSections(sectionsData);
        
        // Get course reviews
        const reviewsData = await courseService.getCourseReviews(courseId);
        setReviews(reviewsData);
        
        // Check if user is enrolled in this course
        if (isAuthenticated) {
          try {
            const enrollments = await courseService.getUserEnrollments();
            const userEnrollment = enrollments.find(e => e.course.id === parseInt(courseId));
            
            if (userEnrollment) {
              setIsEnrolled(true);
              setEnrollment(userEnrollment);
            }
          } catch (err) {
            console.error('Error checking enrollment status:', err);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching course details:', err);
      }
    };

    fetchCourseDetails();
  }, [courseId, isAuthenticated]);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/auth/login', { state: { redirectTo: `/courses/${courseId}` } });
      return;
    }

    try {
      await courseService.enrollCourse(courseId);
      setIsEnrolled(true);
      // Refresh the page to update enrollment status
      window.location.reload();
    } catch (err) {
      console.error('Error enrolling in course:', err);
      // Show error message to user
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { redirectTo: `/courses/${courseId}` } });
      return;
    }

    try {
      await courseService.addReview(courseId, reviewData);
      
      // Refresh reviews
      const updatedReviews = await courseService.getCourseReviews(courseId);
      setReviews(updatedReviews);
      
      // Reset form and close modal
      setReviewData({ rating: 5, comment: '' });
      setReviewModalOpen(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      // Show error message to user
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p>{error || 'Failed to load course'}</p>
          <Link to="/courses" className="text-blue-500 mt-4 inline-block">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb navigation */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-white">
            <Link to="/courses" className="flex items-center hover:underline">
              <ArrowLeft size={16} className="mr-2" />
              Quay lại khóa học
            </Link>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white">{course.courseName}</h1>
        </div>
      </div>

      {/* Course details */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - Left side */}
          <div className="w-full lg:w-8/12">
            {/* Course preview image/video */}
            <div className="bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden mb-6 relative">
              {course.courseImageUrl ? (
                <img 
                  src={course.courseImageUrl} 
                  alt={course.courseName} 
                  className="w-full h-64 md:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-96 bg-gradient-to-r from-blue-500 to-indigo-700 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-white">{course.courseLevel}</h2>
                </div>
              )}
            </div>

            {/* Tabs navigation */}
            <div className="border-b dark:border-gray-700 mb-6">
              <div className="flex overflow-x-auto">
                <button 
                  className={`py-4 px-6 font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 dark:text-gray-300'}`} 
                  onClick={() => setActiveTab('overview')}
                >
                  Tổng quan
                </button>
                <button 
                  className={`py-4 px-6 font-medium ${activeTab === 'curriculum' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 dark:text-gray-300'}`} 
                  onClick={() => setActiveTab('curriculum')}
                >
                  Nội dung khóa học
                </button>
                <button 
                  className={`py-4 px-6 font-medium ${activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600 dark:text-gray-300'}`} 
                  onClick={() => setActiveTab('reviews')}
                >
                  Đánh giá ({reviews.length})
                </button>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">Mô tả khóa học</h2>
                  <div className="prose max-w-none dark:prose-invert">
                    <p className="text-gray-700 dark:text-gray-300">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">Bạn sẽ học được gì</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                      <p className="text-gray-700 dark:text-gray-300">Nắm vững các kiến thức cơ bản về tiếng Hàn</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                      <p className="text-gray-700 dark:text-gray-300">Phát triển kỹ năng nghe, nói, đọc, viết</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                      <p className="text-gray-700 dark:text-gray-300">Luyện tập với nhiều bài tập thực tế</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                      <p className="text-gray-700 dark:text-gray-300">Chuẩn bị đầy đủ cho kỳ thi TOPIK</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Nội dung khóa học</h2>
                
                {sections.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Chưa có nội dung cho khóa học này.</p>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                        {/* Section header */}
                        <button 
                          className="w-full bg-gray-100 dark:bg-gray-800 py-4 px-6 flex justify-between items-center"
                          onClick={() => toggleModule(section.id)}
                        >
                          <div>
                            <h3 className="font-medium text-left dark:text-white">
                              {section.sectionName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {section.lessons?.length || 0} bài học
                            </p>
                          </div>
                          {expandedModule === section.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                        
                        {/* Section content */}
                        {expandedModule === section.id && (
                          <div className="divide-y dark:divide-gray-700">
                            {section.lessons && section.lessons.map((lesson) => (
                              <div key={lesson.id} className="py-4 px-6 flex justify-between items-center">
                                <div className="flex items-center">
                                  <Play size={16} className="text-blue-500 mr-3" />
                                  <span className="dark:text-white">{lesson.lessonName}</span>
                                </div>
                                {isEnrolled ? (
                                  <Link 
                                    to={`/courses/${courseId}/learn/${lesson.id}`}
                                    className="text-blue-500 text-sm hover:underline"
                                  >
                                    Học ngay
                                  </Link>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    {lesson.lessonDuration || '15 phút'}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold dark:text-white">Đánh giá từ học viên</h2>
                  {isAuthenticated && isEnrolled && (
                    <button
                      onClick={() => setReviewModalOpen(true)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Viết đánh giá
                    </button>
                  )}
                </div>
                
                {/* Rating overview */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-4xl font-bold mr-2 dark:text-white">{calculateAverageRating()}</h3>
                    <div>
                      <div className="flex mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < Math.round(calculateAverageRating()) ? "currentColor" : "none"}
                            className={i < Math.round(calculateAverageRating()) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{reviews.length} đánh giá</p>
                    </div>
                  </div>
                </div>
                
                {/* Reviews list */}
                {reviews.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Chưa có đánh giá nào cho khóa học này.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b dark:border-gray-700 pb-6 last:border-0">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                            <span className="font-bold text-gray-600 dark:text-gray-300">
                              {review.user?.name?.charAt(0) || review.user?.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium dark:text-white">{review.user?.name || 'Học viên'}</h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    fill={i < review.rating ? "currentColor" : "none"}
                                    className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                                  />
                                ))}
                              </div>
                              <span>{formatDate(review.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Right side */}
          <div className="w-full lg:w-4/12">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold dark:text-white">
                  {course.isFree ? (
                    'Miễn phí'
                  ) : (
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.coursePrice || 0)
                  )}
                </span>
              </div>
              
              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                {isEnrolled ? (
                  <>
                    <Link
                      to={`/courses/${courseId}/learn`}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-bold"
                    >
                      Tiếp tục học
                    </Link>
                    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg">
                      <BarChart className="mr-2 text-blue-500" size={18} />
                      <span className="dark:text-white">{enrollment?.progress || 0}% hoàn thành</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold"
                  >
                    {course.isFree ? 'Đăng ký miễn phí' : 'Đăng ký ngay'}
                  </button>
                )}
                
                <button
                  onClick={toggleWishlist}
                  className="w-full border dark:border-gray-600 py-3 px-4 rounded-lg font-medium flex justify-center items-center gap-2"
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : "text-gray-500"} />
                  <span className="dark:text-white">Thêm vào danh sách yêu thích</span>
                </button>
                
                <button className="w-full border dark:border-gray-600 py-3 px-4 rounded-lg font-medium flex justify-center items-center gap-2">
                  <Share2 size={18} className="text-gray-500" />
                  <span className="dark:text-white">Chia sẻ</span>
                </button>
              </div>
              
              {/* Course includes */}
              <div className="mb-6">
                <h3 className="font-bold mb-3 dark:text-white">Khóa học bao gồm:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <Clock className="mr-3 text-gray-400" size={18} />
                    <span>{sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0)} bài học</span>
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <BookOpen className="mr-3 text-gray-400" size={18} />
                    <span>Tài liệu học tập</span>
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <Globe className="mr-3 text-gray-400" size={18} />
                    <span>Truy cập trọn đời</span>
                  </li>
                </ul>
              </div>
              
              {/* Course info */}
              <div>
                <h3 className="font-bold mb-3 dark:text-white">Thông tin khóa học</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-1/3 text-gray-500">Cấp độ:</span>
                    <span>{course.courseLevel}</span>
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-1/3 text-gray-500">Học viên:</span>
                    <span>{course.enrollments?.length || 0}</span>
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-1/3 text-gray-500">Ngày tạo:</span>
                    <span>{formatDate(course.createdAt)}</span>
                  </li>
                  <li className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-1/3 text-gray-500">Cập nhật:</span>
                    <span>{formatDate(course.lastModified)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold dark:text-white">Đánh giá khóa học</h3>
                <button 
                  onClick={() => setReviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Đánh giá</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          fill={star <= reviewData.rating ? "currentColor" : "none"}
                          className={star <= reviewData.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="review-comment">
                    Nhận xét của bạn
                  </label>
                  <textarea
                    id="review-comment"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    className="w-full border dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700 dark:text-white"
                    rows="4"
                    required
                    placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Gửi đánh giá
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailAPI;
