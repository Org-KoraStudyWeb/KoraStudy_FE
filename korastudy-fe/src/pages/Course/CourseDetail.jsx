import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  Loader,
  AlertCircle,
} from "lucide-react";
import courseService from "../../api/courseService";

const CourseDetailNew = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

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
    // Try to compute total duration in minutes if lessons have duration fields
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

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // Fetch sections and lessons
        const sectionsData = await courseService.getSectionsByCourseId(
          courseId
        );
        setSections(sectionsData);

        // Fetch reviews
        const reviewsData = await courseService.getCourseReviews(
          courseId,
          0,
          10
        );
        setReviews(reviewsData.content || reviewsData || []);
      } catch (err) {
        setError("Không thể tải thông tin khóa học. Vui lòng thử lại sau.");
        console.error("Error fetching course data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const enrollmentData = await courseService.enrollCourse(courseId);
      setEnrollmentStatus("enrolled");
      alert("Đăng ký khóa học thành công!");
    } catch (err) {
      console.error("Error enrolling course:", err);
      alert("Có lỗi xảy ra khi đăng ký khóa học.");
    }
  };

  const formatPrice = (price, isFree) => {
    if (isFree) return "Miễn phí";
    if (!price || price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
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
                to="/courses"
                className="text-primary-500 hover:underline mt-2 inline-block"
              >
                ← Quay lại danh sách khóa học
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Quay lại danh sách khóa học
              </Link>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {levelToLabel(course.courseLevel)}
                </span>
                {course.isFree && (
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                    Miễn phí
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.courseName}</h1>
              <p className="text-xl mb-6 text-white/90">
                {(() => {
                  const { totalLessons, totalDurationMinutes } = getTotals();
                  return `${formatMinutes(totalDurationMinutes)}${
                    totalDurationMinutes ? " • " : ""
                  }${totalLessons} bài học`;
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

              <div className="text-white/80">
                <p>Tạo ngày: {formatDate(course.createdAt)}</p>
                <p>Cập nhật lần cuối: {formatDate(course.lastModified)}</p>
              </div>
            </div>

            {/* Right Content - Course Card */}
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
                      {formatPrice(course.coursePrice, course.isFree)}
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

                  <Link
                    to={`/checkout?courseId=${courseId}`}
                    className="block w-full bg-primary-500 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors mb-4"
                  >
                    Đăng ký ngay
                  </Link>

                  <div className="text-center text-gray-500 text-sm mb-4">
                    30 ngày đảm bảo hoàn tiền
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

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="border-b">
                  <div className="flex">
                    {[
                      { id: "overview", name: "Tổng quan" },
                      { id: "curriculum", name: "Nội dung khóa học" },
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
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          Mô tả khóa học
                        </h3>
                        <div className="prose prose-gray max-w-none">
                          <p>{course.courseDescription}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Curriculum Tab */}
                  {activeTab === "curriculum" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                          Nội dung khóa học
                        </h3>
                        <div className="text-sm text-gray-600">
                          {sections.length} chương
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
                                    className="flex items-center gap-3 py-2"
                                  >
                                    <Play
                                      size={16}
                                      className="text-primary-500"
                                    />
                                    <span className="flex-1">
                                      {lesson.lessonTitle}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {lesson.contentType}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
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

                      <div className="space-y-4">
                        {reviews.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            Chưa có đánh giá nào cho khóa học này.
                          </p>
                        ) : (
                          reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4">
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

            {/* Right Sidebar - Course Info */}
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
                    <span className="text-gray-600">Cập nhật:</span>
                    <span className="font-medium">
                      {formatDate(course.lastModified)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailNew;
