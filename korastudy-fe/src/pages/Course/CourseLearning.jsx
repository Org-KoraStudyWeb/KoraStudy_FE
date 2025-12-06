import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  CheckCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  Menu,
  X,
  FileText,
  Video,
  CheckCircle2,
  Circle,
} from "lucide-react";
import courseService from "../../api/courseService";
import sectionService from "../../api/sectionService";
import enrollmentService from "../../api/enrollmentService";
import lessonService from "../../api/lessonService";
import DOMPurify from "dompurify";

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});

  // Tính tổng bài học
  const getTotals = () => {
    const totalSections = Array.isArray(sections) ? sections.length : 0;
    const totalLessons = Array.isArray(sections)
      ? sections.reduce((sum, s) => sum + (s?.lessons?.length || 0), 0)
      : 0;

    return { totalSections, totalLessons };
  };

  // Hàm tính progress dựa trên số bài học đã hoàn thành
  const calculateProgress = () => {
    const { totalLessons } = getTotals();
    if (totalLessons === 0) return 0;

    const completedLessons = Object.values(lessonProgress).filter(
      (progress) => progress.completed
    ).length;

    const calculatedProgress = Math.round(
      (completedLessons / totalLessons) * 100
    );
    console.log(
      `📊 Progress tính toán: ${completedLessons}/${totalLessons} = ${calculatedProgress}%`
    );
    return calculatedProgress;
  };

  const formatMinutes = (minutes) => {
    if (!minutes || !Number.isFinite(minutes) || minutes <= 0) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs} giờ ${mins} phút`;
    if (hrs > 0) return `${hrs} giờ`;
    return `${mins} phút`;
  };

  // Hàm fetch progress của tất cả bài học trong khóa học
  const fetchLessonProgress = async () => {
    try {
      console.log(
        `📥 Đang gọi API getUserProgressByCourse với courseId: ${courseId}`
      );
      const progressData = await lessonService.getUserProgressByCourse(
        courseId
      );
      console.log("📥 Dữ liệu progress nhận được:", progressData);

      // Chuyển đổi mảng progress thành object để dễ truy cập
      const progressMap = {};
      progressData.forEach((progress) => {
        progressMap[progress.lessonId] = {
          completed: progress.status === "COMPLETED",
          status: progress.status,
          progress: progress.progress || 0,
        };
      });

      setLessonProgress(progressMap);

      // Cập nhật progress sau khi fetch
      const newProgress = calculateProgress();
      setProgress(newProgress);

      return progressMap;
    } catch (error) {
      console.error("❌ Lỗi khi lấy tiến độ bài học:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      return {};
    }
  };

  // Kiểm tra xem bài học đã hoàn thành chưa
  const isLessonCompleted = (lessonId) => {
    return lessonProgress[lessonId]?.completed || false;
  };

  // Hàm toggle hoàn thành bài học
  const toggleLessonComplete = async (lessonId, isCurrentlyCompleted) => {
    try {
      console.log(
        "🎯 Đang toggle trạng thái lessonId:",
        lessonId,
        "hiện tại:",
        isCurrentlyCompleted
      );

      const newStatus = isCurrentlyCompleted ? "NOT_STARTED" : "COMPLETED";

      // Gọi API để cập nhật trạng thái bài học
      const result = await lessonService.updateLessonProgress({
        lessonId: lessonId,
        status: newStatus,
        timeSpent: 300, // Thời gian mặc định
      });

      console.log("✅ Kết quả từ API updateLessonProgress:", result);

      // Cập nhật UI local ngay lập tức
      setLessonProgress((prev) => ({
        ...prev,
        [lessonId]: {
          completed: !isCurrentlyCompleted,
          status: newStatus,
          progress: !isCurrentlyCompleted ? 100 : 0,
        },
      }));

      // Cập nhật sections để hiển thị đúng trạng thái
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          lessons: section.lessons?.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, completed: !isCurrentlyCompleted }
              : lesson
          ),
        }))
      );

      // Cập nhật currentLesson nếu đang được chọn
      if (currentLesson?.id === lessonId) {
        setCurrentLesson((prev) => ({
          ...prev,
          completed: !isCurrentlyCompleted,
        }));
      }

      // Tính toán lại progress ngay lập tức
      const newProgress = calculateProgress();
      setProgress(newProgress);

      console.log(`✅ Đã cập nhật progress: ${newProgress}%`);
    } catch (err) {
      console.error("❌ Error toggling lesson complete:", err);
      console.error("Chi tiết lỗi:", err.response?.data);
      alert("Có lỗi khi cập nhật trạng thái bài học. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Kiểm tra enrollment trước
        const enrollmentData = await enrollmentService.checkMyEnrollment(
          courseId
        );
        if (!enrollmentData) {
          navigate(`/my-courses/${course.id}`);
          return;
        }
        setEnrollment(enrollmentData);

        // Fetch course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // Fetch sections và lessons
        const sectionsData = await sectionService.getSectionsByCourseId(
          courseId
        );

        // Fetch progress của tất cả bài học trước khi set sections
        const progressMap = await fetchLessonProgress();

        // Cập nhật sections với trạng thái completed từ progress
        const sectionsWithProgress = sectionsData.map((section) => ({
          ...section,
          lessons: section.lessons?.map((lesson) => ({
            ...lesson,
            completed: progressMap[lesson.id]?.completed || false,
          })),
        }));

        setSections(sectionsWithProgress);

        // Tìm lesson đầu tiên để hiển thị
        if (
          sectionsWithProgress.length > 0 &&
          sectionsWithProgress[0].lessons?.length > 0
        ) {
          const firstLesson = sectionsWithProgress[0].lessons[0];
          setCurrentLesson(firstLesson);
          setExpandedSection(sectionsWithProgress[0].id);
        }

        // Tính toán progress từ lessonProgress
        const calculatedProgress = calculateProgress();
        setProgress(calculatedProgress);
      } catch (err) {
        console.error("Error fetching course data:", err);
        if (err.response?.status === 403 || err.response?.status === 404) {
          setError(
            "Bạn chưa đăng ký khóa học này hoặc khóa học không tồn tại."
          );
        } else {
          setError("Không thể tải thông tin khóa học. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, navigate]);

  // Effect để tự động tính progress khi lessonProgress thay đổi
  useEffect(() => {
    if (Object.keys(lessonProgress).length > 0) {
      const newProgress = calculateProgress();
      setProgress(newProgress);
    }
  }, [lessonProgress]);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    // Trên mobile, tự động đóng sidebar khi chọn bài học
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const getLessonIcon = (lesson) => {
    if (lesson.contentType === "VIDEO")
      return <Video size={16} className="text-blue-500" />;
    if (lesson.contentType === "DOCUMENT")
      return <FileText size={16} className="text-green-500" />;
    return <FileText size={16} className="text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-primary-500" size={48} />
          <span className="ml-3 text-lg">Đang tải khóa học...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle size={48} />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
              <p>{error || "Không tìm thấy khóa học"}</p>
              <Link
                to={`/my-courses/${course.id}`}
                className="text-primary-500 hover:underline mt-2 inline-block"
              >
                ← Quay lại khóa học của tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totalLessons } = getTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link
                to={`/my-courses/${course.id}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span className="hidden lg:inline">Khóa học của tôi</span>
              </Link>

              <div className="lg:hidden">
                <h1 className="text-lg font-semibold truncate max-w-xs">
                  {course.courseName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress bar */}
              <div className="hidden md:block w-32">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* ĐÃ XÓA "Xem chi tiết" */}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Course Content */}
        <div
          className={`
          bg-white border-r border-gray-200 w-80 lg:w-96 flex-shrink-0 h-full overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          fixed lg:relative z-30
        `}
        >
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg mb-2">Nội dung khóa học</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>{progress}% hoàn thành</span>
              <span>•</span>
              <span>{totalLessons} bài học</span>
            </div>
          </div>

          <div className="p-4">
            {sections.map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )
                  }
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {section.sectionName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.lessons?.length || 0} bài học
                    </p>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {expandedSection === section.id && section.lessons && (
                  <div className="mt-2 space-y-1">
                    {section.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                          ${
                            currentLesson?.id === lesson.id
                              ? "bg-blue-50 border border-blue-200"
                              : "hover:bg-gray-50 border border-gray-100"
                          }
                        `}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium">
                          {index + 1}
                        </div>
                        <button
                          onClick={() => handleLessonSelect(lesson)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {lesson.lessonTitle}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            {getLessonIcon(lesson)}
                            {lesson.duration && (
                              <>
                                <span>{formatMinutes(lesson.duration)}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>
                              {isLessonCompleted(lesson.id)
                                ? "Đã hoàn thành"
                                : "Chưa hoàn thành"}
                            </span>
                          </div>
                        </button>
                        {/* Nút toggle hoàn thành */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
                            toggleLessonComplete(
                              lesson.id,
                              isLessonCompleted(lesson.id)
                            );
                          }}
                          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                          title={
                            isLessonCompleted(lesson.id)
                              ? "Đánh dấu chưa hoàn thành"
                              : "Đánh dấu đã hoàn thành"
                          }
                        >
                          {isLessonCompleted(lesson.id) ? (
                            <CheckCircle2
                              size={20}
                              className="text-green-500 hover:text-green-600"
                            />
                          ) : (
                            <Circle
                              size={20}
                              className="text-gray-300 hover:text-gray-400"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Lesson Viewer */}
        <div className="flex-1 h-full overflow-y-auto bg-white">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto p-6">
              {/* Lesson Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>
                    {currentLesson.contentType === "VIDEO"
                      ? "Video"
                      : "Tài liệu"}
                  </span>
                  <span>•</span>
                  <span>
                    Bài{" "}
                    {sections
                      .flatMap((s) => s.lessons)
                      .findIndex((l) => l.id === currentLesson.id) + 1}{" "}
                    của {totalLessons}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentLesson.lessonTitle}
                </h1>

                {/* ĐÃ XÓA nút "Đánh dấu hoàn thành" dưới tiêu đề */}
              </div>

              {/* Lesson Content */}
              <div className="bg-gray-100 rounded-lg p-6">
                {currentLesson.contentType === "VIDEO" &&
                currentLesson.videoUrl ? (
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full"
                      src={currentLesson.videoUrl}
                    >
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                ) : currentLesson.documentUrl ? (
                  <div className="text-center py-12">
                    <FileText
                      size={64}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600 mb-4">
                      Tài liệu: {currentLesson.lessonTitle}
                    </p>
                    <a
                      href={currentLesson.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
                    >
                      <FileText size={20} />
                      Mở tài liệu
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText
                      size={64}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600">
                      Nội dung bài học đang được cập nhật...
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Description */}
              {currentLesson.content && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4">Mô tả bài học</h3>
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentLesson.content || ""),
                    }}
                  />
                </div>
              )}

              {/* ĐÃ XÓA Navigation bài trước/bài tiếp theo */}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chọn bài học để bắt đầu
                </h3>
                <p className="text-gray-600">
                  Chọn một bài học từ danh sách bên trái để bắt đầu học.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CourseLearning;
