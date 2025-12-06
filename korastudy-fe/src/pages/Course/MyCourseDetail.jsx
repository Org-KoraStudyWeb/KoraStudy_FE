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
  BarChart,
  Target,
  Award,
  Calendar,
  FileText,
  Video,
  Share2,
  Heart,
  Send,
} from "lucide-react";
import courseService from "../../api/courseService";
import sectionService from "../../api/sectionService";
import enrollmentService from "../../api/enrollmentService";
import lessonService from "../../api/lessonService"; // THÊM IMPORT
import DOMPurify from "dompurify";

const MyCourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [expandedSection, setExpandedSection] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState({}); // THÊM STATE

  // State cho phần đánh giá
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const levelToLabel = (level) => {
    if (!level) return "";
    const value = String(level).toLowerCase();
    if (value.includes("begin")) return "Khóa học sơ cấp";
    if (value.includes("inter")) return "Khóa học trung cấp";
    if (value.includes("adv")) return "Khóa học cao cấp";
    return level;
  };

  const getTotals = () => {
    const totalSections = Array.isArray(sections) ? sections.length : 0;
    const totalLessons = Array.isArray(sections)
      ? sections.reduce((sum, s) => sum + (s?.lessons?.length || 0), 0)
      : 0;

    const totalDurationMinutes = Array.isArray(sections)
      ? sections.reduce((sum, s) => {
          const lessonMinutes = (s?.lessons || []).reduce((acc, l) => {
            const d = l?.durationMinutes ?? l?.duration_min ?? l?.duration;
            return acc + (typeof d === "number" && Number.isFinite(d) ? d : 0);
          }, 0);
          return sum + lessonMinutes;
        }, 0)
      : 0;

    return { totalSections, totalLessons, totalDurationMinutes };
  };

  const formatMinutes = (minutes) => {
    if (!minutes || !Number.isFinite(minutes) || minutes <= 0) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs} giờ ${mins} phút`;
    if (hrs > 0) return `${hrs} giờ`;
    return `${mins} phút`;
  };

  // THÊM: Hàm fetch progress của tất cả bài học trong khóa học
  const fetchLessonProgress = async () => {
    try {
      const progressData = await lessonService.getUserProgressByCourse(
        courseId
      );

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
      return progressMap;
    } catch (error) {
      console.error("❌ Lỗi khi lấy tiến độ bài học:", error);
      return {};
    }
  };

  // THÊM: Hàm tính progress thực tế
  const calculateRealProgress = () => {
    const { totalLessons } = getTotals();
    if (totalLessons === 0) return 0;

    const completedLessons = Object.values(lessonProgress).filter(
      (progress) => progress.completed
    ).length;

    const calculatedProgress = Math.round(
      (completedLessons / totalLessons) * 100
    );
    return calculatedProgress;
  };

  // THÊM: Hàm tính progress cho từng section
  const calculateSectionProgress = (section) => {
    if (!section.lessons || section.lessons.length === 0) return 0;

    const completedLessonsInSection = section.lessons.filter(
      (lesson) => lessonProgress[lesson.id]?.completed
    ).length;

    return Math.round(
      (completedLessonsInSection / section.lessons.length) * 100
    );
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Kiểm tra enrollment
        const enrollmentData = await enrollmentService.checkMyEnrollment(
          courseId
        );
        if (!enrollmentData) {
          navigate("/my-courses");
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
        setSections(sectionsData);

        // THÊM: Fetch progress của tất cả bài học
        await fetchLessonProgress();

        // Fetch reviews
        const reviewsData = await courseService.getCourseReviews(
          courseId,
          0,
          10
        );
        setReviews(reviewsData.content || reviewsData || []);
      } catch (err) {
        console.error("Error fetching course data:", err);
        if (err.response?.status === 403 || err.response?.status === 404) {
          setError("Bạn chưa đăng ký khóa học này.");
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

  const handleStartLearning = () => {
    navigate(`/learning/${courseId}`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmittingReview(true);
      // Gọi API để submit review
      const response = await courseService.submitCourseReview(courseId, {
        rating: newReview.rating,
        comment: newReview.comment,
      });

      // Thêm review mới vào danh sách
      setReviews((prev) => [response, ...prev]);

      // Reset form
      setNewReview({
        rating: 5,
        comment: "",
      });

      alert("Đánh giá của bạn đã được gửi thành công!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getLessonIcon = (lesson) => {
    if (lesson.contentType === "VIDEO")
      return <Video size={16} className="text-blue-500" />;
    if (lesson.contentType === "DOCUMENT")
      return <FileText size={16} className="text-green-500" />;
    return <FileText size={16} className="text-gray-500" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // THÊM: Kiểm tra xem bài học đã hoàn thành chưa
  const isLessonCompleted = (lessonId) => {
    return lessonProgress[lessonId]?.completed || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <Loader className="animate-spin text-primary-500" size={48} />
            <span className="ml-3 text-lg">Đang tải thông tin khóa học...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle size={48} />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
              <p>{error || "Không tìm thấy khóa học"}</p>
              <Link
                to="/my-courses"
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

  const { totalLessons, totalDurationMinutes } = getTotals();
  const progress = calculateRealProgress(); // SỬA: Dùng progress tính toán thực tế

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Giống CourseDetail */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <Link
                to="/my-courses"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Quay lại khóa học của tôi
              </Link>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {levelToLabel(course.courseLevel)}
                </span>
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                  Đã đăng ký
                </span>
                {progress === 100 && (
                  <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-medium">
                    Đã hoàn thành
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.courseName}</h1>
              <p className="text-xl mb-6 text-white/90">
                {(() => {
                  const { totalLessons, totalDurationMinutes } = getTotals();
                  return `${formatMinutes(totalDurationMinutes)}${
                    totalDurationMinutes ? " • " : ""
                  }${totalLessons} bài học • ${progress}% hoàn thành`;
                })()}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="font-semibold">
                    {course.averageRating
                      ? course.averageRating.toFixed(1)
                      : "5.0"}
                  </span>
                  <span className="text-white/80">
                    ({course.reviewCount || 0} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>{course.enrollmentCount || 0} học viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>{course.viewCount || 0} lượt xem</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 text-white/90">
                  <span>Tiến độ của bạn</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleStartLearning}
                className="bg-white text-primary-500 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Play size={20} />
                {progress === 0
                  ? "Bắt đầu học"
                  : progress === 100
                  ? "Ôn tập lại"
                  : "Tiếp tục học"}
              </button>
            </div>

            {/* Right Content - Course Card - Giống CourseDetail */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
                <div className="relative">
                  <img
                    src={course.courseImageUrl || "/placeholder-course.jpg"}
                    alt={course.courseName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button className="bg-white/90 hover:bg-white rounded-full p-4 transition-colors">
                      <Play className="text-primary-500" size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-primary-500">
                      {course.isFree ? "Miễn phí" : "Đã thanh toán"}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Heart
                          className={
                            isWishlisted
                              ? "text-red-500 fill-current"
                              : "text-gray-400"
                          }
                          size={20}
                        />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Share2 className="text-gray-400" size={20} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleStartLearning}
                    className="block w-full bg-primary-500 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors mb-4"
                  >
                    {progress === 0
                      ? "Bắt đầu học"
                      : progress === 100
                      ? "Ôn tập lại"
                      : "Tiếp tục học"}
                  </button>

                  <div className="text-center text-gray-500 text-sm mb-4">
                    Đã đăng ký: {formatDate(enrollment?.enrollDate)}
                  </div>

                  <div className="space-y-3 text-gray-600">
                    <h4 className="font-semibold">Khóa học bao gồm:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span>Truy cập trọn đời</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span>Tài liệu PDF</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span>Hỗ trợ trực tuyến</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span>Chứng chỉ hoàn thành</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content - Giống CourseDetail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Tabs - Giống CourseDetail */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="border-b">
                  <div className="flex">
                    {[
                      { id: "content", name: "Nội dung khóa học" },
                      { id: "overview", name: "Tổng quan" },
                      { id: "progress", name: "Tiến độ" },
                      { id: "reviews", name: "Đánh giá" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 font-medium transition-colors ${
                          activeTab === tab.id
                            ? "text-primary-500 border-b-2 border-primary-500"
                            : "text-gray-600 hover:text-primary-500"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8">
                  {/* Content Tab */}
                  {activeTab === "content" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                          Nội dung khóa học
                        </h3>
                        <div className="text-sm text-gray-600">
                          {sections.length} chương • {totalLessons} bài học •{" "}
                          {progress}% hoàn thành
                        </div>
                      </div>

                      {sections.map((section) => (
                        <div key={section.id} className="border rounded-lg">
                          <button
                            onClick={() =>
                              setExpandedSection(
                                expandedSection === section.id
                                  ? null
                                  : section.id
                              )
                            }
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div>
                              <h4 className="font-semibold">
                                {section.sectionName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {section.lessons?.length || 0} bài học
                              </p>
                            </div>
                            {expandedSection === section.id ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>

                          {expandedSection === section.id &&
                            section.lessons && (
                              <div className="px-4 pb-4">
                                {section.lessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded-lg px-2"
                                  >
                                    {getLessonIcon(lesson)}
                                    <span className="flex-1">
                                      {lesson.lessonTitle}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {lesson.duration
                                        ? formatMinutes(lesson.duration)
                                        : ""}
                                    </span>
                                    {/* THÊM: Hiển thị trạng thái hoàn thành */}
                                    {isLessonCompleted(lesson.id) ? (
                                      <span className="text-green-500 text-sm font-medium">
                                        ✓ Đã hoàn thành
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          navigate(
                                            `/learning/${courseId}?lesson=${lesson.id}`
                                          )
                                        }
                                        className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                                      >
                                        Học ngay
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Mô tả khóa học
                        </h3>
                        <div className="prose prose-gray max-w-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                course.courseDescription || ""
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Progress Tab - ĐÃ SỬA: Dùng progress thực tế */}
                  {activeTab === "progress" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                          Tiến độ học tập
                        </h3>
                        <div className="text-2xl font-bold text-primary-500">
                          {progress}%
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium">Tổng quan</span>
                          <span className="text-sm text-gray-600">
                            {Math.round((progress / 100) * totalLessons)}/
                            {totalLessons} bài học
                          </span>
                        </div>

                        <div className="space-y-4">
                          {sections.map((section, index) => {
                            const sectionProgress =
                              calculateSectionProgress(section);
                            const completedLessonsInSection =
                              section.lessons?.filter((lesson) =>
                                isLessonCompleted(lesson.id)
                              ).length || 0;
                            const totalLessonsInSection =
                              section.lessons?.length || 0;

                            return (
                              <div
                                key={section.id}
                                className="bg-white rounded-lg p-4 border"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    Chương {index + 1}: {section.sectionName}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {sectionProgress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${sectionProgress}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {completedLessonsInSection}/
                                  {totalLessonsInSection} bài học đã hoàn thành
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={handleStartLearning}
                          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                        >
                          {progress === 100
                            ? "Ôn tập khóa học"
                            : "Tiếp tục học tập"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                          Đánh giá học viên
                        </h3>
                        <div className="flex items-center gap-2">
                          <Star
                            className="text-yellow-400 fill-current"
                            size={20}
                          />
                          <span className="font-semibold">
                            {course.averageRating
                              ? course.averageRating.toFixed(1)
                              : "5.0"}
                          </span>
                          <span className="text-gray-500">
                            ({course.reviewCount || 0} đánh giá)
                          </span>
                        </div>
                      </div>

                      {/* Form viết đánh giá */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold mb-4">
                          Viết đánh giá của bạn
                        </h4>
                        <form onSubmit={handleSubmitReview}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Đánh giá sao
                            </label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setNewReview((prev) => ({
                                      ...prev,
                                      rating: star,
                                    }))
                                  }
                                  className="p-1"
                                >
                                  <Star
                                    size={24}
                                    className={
                                      star <= newReview.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nhận xét của bạn
                            </label>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) =>
                                setNewReview((prev) => ({
                                  ...prev,
                                  comment: e.target.value,
                                }))
                              }
                              placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              rows="4"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={
                              submittingReview || !newReview.comment.trim()
                            }
                            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                          >
                            <Send size={16} />
                            {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                          </button>
                        </form>
                      </div>

                      {/* Danh sách đánh giá */}
                      <div className="space-y-6">
                        <h4 className="font-semibold text-lg">
                          Đánh giá từ học viên
                        </h4>

                        {reviews.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            Chưa có đánh giá nào cho khóa học này.
                          </p>
                        ) : (
                          reviews.map((review) => (
                            <div
                              key={review.id}
                              className="border-b pb-6 last:border-b-0"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {review.user?.fullName?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <div className="font-semibold">
                                    {review.user?.fullName ||
                                      "Người dùng ẩn danh"}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          className={
                                            i < review.rating
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(review.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Course Info - Giống CourseDetail */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h4 className="font-semibold mb-4">Thông tin khóa học</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cấp độ:</span>
                    <span className="font-medium">{course.courseLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lượt xem:</span>
                    <span className="font-medium">{course.viewCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Học viên:</span>
                    <span className="font-medium">
                      {course.enrollmentCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đánh giá:</span>
                    <span className="font-medium">
                      {course.reviewCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiến độ của bạn:</span>
                    <span className="font-medium text-primary-500">
                      {progress}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đăng ký từ:</span>
                    <span className="font-medium">
                      {formatDate(enrollment?.enrollDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thêm phần hỗ trợ học tập */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h4 className="font-semibold mb-4">Hỗ trợ học tập</h4>
                <div className="space-y-3 text-sm">
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                    📚 Tài liệu bổ sung
                  </button>
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                    💬 Diễn đàn thảo luận
                  </button>
                  <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                    🎯 Bài tập thực hành
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyCourseDetail;
