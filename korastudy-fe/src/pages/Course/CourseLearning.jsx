import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X, List, CheckCircle, BookOpen, BarChart } from 'lucide-react';
import courseService from '../../api/courseService';
import { useAuth } from '../../contexts/AuthContext';

const CourseLearningPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allLessons, setAllLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Check if user is authenticated and enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isAuthenticated) {
        navigate(`/auth/login?redirect=/courses/${courseId}/learn`);
        return;
      }

      try {
        const enrollments = await courseService.getUserEnrollments();
        const userEnrollment = enrollments.find(e => e.course.id === parseInt(courseId));

        if (!userEnrollment) {
          navigate(`/courses/${courseId}`);
          return;
        }

        setEnrollment(userEnrollment);
      } catch (err) {
        console.error('Error checking enrollment status:', err);
        navigate(`/courses/${courseId}`);
      }
    };

    checkEnrollment();
  }, [isAuthenticated, courseId, navigate]);

  // Fetch course and lesson data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Get course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // Get course sections with lessons
        const sectionsData = await courseService.getSectionsByCourseId(courseId);
        setSections(sectionsData);

        // Create a flattened array of all lessons for navigation
        const lessons = [];
        sectionsData.forEach(section => {
          if (section.lessons) {
            section.lessons.forEach(lesson => {
              lessons.push({
                ...lesson,
                sectionId: section.id,
                sectionName: section.sectionName
              });
            });
          }
        });
        setAllLessons(lessons);

        // Determine which lesson to show
        let targetLessonId = lessonId;
        
        // If no specific lesson is requested, show the first one
        if (!targetLessonId && lessons.length > 0) {
          targetLessonId = lessons[0].id;
          navigate(`/courses/${courseId}/learn/${targetLessonId}`, { replace: true });
        }

        // Find the current lesson
        if (targetLessonId) {
          const lesson = lessons.find(l => l.id === parseInt(targetLessonId));
          const lessonIndex = lessons.findIndex(l => l.id === parseInt(targetLessonId));
          
          if (lesson) {
            setCurrentLesson(lesson);
            setCurrentLessonIndex(lessonIndex);
            
            // Get lesson details
            const lessonDetails = await courseService.getLessonById(courseId, lesson.sectionId, lesson.id);
            setCurrentLesson({...lesson, ...lessonDetails});
          } else {
            // If lesson not found, redirect to first lesson
            if (lessons.length > 0) {
              navigate(`/courses/${courseId}/learn/${lessons[0].id}`, { replace: true });
            } else {
              setError('No lessons found in this course.');
            }
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load course content. Please try again later.');
        setLoading(false);
        console.error('Error fetching course data:', err);
      }
    };

    if (enrollment) {
      fetchCourseData();
    }
  }, [courseId, lessonId, enrollment, navigate]);

  // Handle lesson completion
  const markLessonAsCompleted = async () => {
    if (!currentLesson) return;

    try {
      await courseService.completeLesson(courseId, currentLesson.id);
      
      // Update enrollment progress
      const updatedEnrollments = await courseService.getUserEnrollments();
      const updatedEnrollment = updatedEnrollments.find(e => e.course.id === parseInt(courseId));
      if (updatedEnrollment) {
        setEnrollment(updatedEnrollment);
      }

      // Navigate to next lesson if available
      if (currentLessonIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentLessonIndex + 1];
        navigate(`/courses/${courseId}/learn/${nextLesson.id}`);
      }
    } catch (err) {
      console.error('Error marking lesson as completed:', err);
    }
  };

  // Navigation to next/previous lesson
  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      navigate(`/courses/${courseId}/learn/${nextLesson.id}`);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      navigate(`/courses/${courseId}/learn/${prevLesson.id}`);
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p>{error || 'Failed to load course'}</p>
          <Link to={`/courses/${courseId}`} className="text-blue-500 mt-4 inline-block">
            Back to Course Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top navbar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              className="mr-4 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} className="dark:text-white" />}
            </button>
            <Link to={`/courses/${courseId}`} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500">
              <ChevronLeft size={20} className="mr-1" />
              <span className="hidden sm:inline">Quay lại khóa học</span>
            </Link>
          </div>

          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg font-medium truncate dark:text-white">{course.courseName}</h1>
          </div>

          <div className="flex items-center">
            {enrollment && (
              <div className="hidden sm:flex items-center mr-4">
                <BarChart size={18} className="text-blue-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{enrollment.progress || 0}% hoàn thành</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${
            sidebarOpen ? 'absolute inset-y-0 left-0 z-40 block w-full sm:w-80 h-full pt-16' : 'hidden'
          } md:relative md:block md:w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium dark:text-white">Nội dung khóa học</h2>
              <button 
                className="text-gray-500 md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {sections.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Không có nội dung cho khóa học này.</p>
            ) : (
              <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <div key={section.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-700 py-3 px-4">
                      <h3 className="font-medium dark:text-white">
                        Phần {sectionIndex + 1}: {section.sectionName}
                      </h3>
                    </div>
                    <div className="divide-y dark:divide-gray-700">
                      {section.lessons && section.lessons.map((lesson, lessonIndex) => {
                        const isActive = currentLesson && currentLesson.id === lesson.id;
                        const isCompleted = false; // We would need to track completed lessons in the API
                        
                        return (
                          <Link 
                            key={lesson.id}
                            to={`/courses/${courseId}/learn/${lesson.id}`}
                            className={`block py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <div className="flex items-center">
                              <div className="mr-3 text-gray-500 dark:text-gray-400">
                                {sectionIndex + 1}.{lessonIndex + 1}
                              </div>
                              <span className={`flex-1 ${isActive ? 'font-medium text-blue-500' : 'dark:text-white'}`}>
                                {lesson.lessonName}
                              </span>
                              {isCompleted && (
                                <CheckCircle size={16} className="text-green-500 ml-2" />
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{currentLesson.lessonName}</h2>
                
                {/* Lesson content */}
                <div className="prose max-w-none dark:prose-invert mb-8">
                  {currentLesson.lessonContent && (
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.lessonContent }} />
                  )}
                  {!currentLesson.lessonContent && (
                    <p className="text-gray-500 dark:text-gray-400">Nội dung bài học đang được cập nhật.</p>
                  )}
                </div>

                {/* Video content if available */}
                {currentLesson.videoUrl && (
                  <div className="mb-8 aspect-w-16 aspect-h-9">
                    <iframe 
                      src={currentLesson.videoUrl} 
                      title={currentLesson.lessonName}
                      className="w-full h-96 rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <button
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentLessonIndex === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <ChevronLeft size={20} className="mr-1" />
                  <span>Bài trước</span>
                </button>

                {currentLessonIndex === allLessons.length - 1 ? (
                  <button
                    onClick={markLessonAsCompleted}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Hoàn thành khóa học
                  </button>
                ) : (
                  <button
                    onClick={markLessonAsCompleted}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center"
                  >
                    <span>Bài tiếp theo</span>
                    <ChevronRight size={20} className="ml-1" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Chọn một bài học từ menu bên trái để bắt đầu học.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
