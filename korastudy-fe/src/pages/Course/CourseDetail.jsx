import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { enrollCourse } from "../../api/enrollmentService";
import courseService from "../../api/courseService";
import sectionService from "../../api/sectionService";
import DOMPurify from "dompurify";
import {
  ArrowLeft,
  Play,
  Users,
  Star,
  BookOpen,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Loader,
  AlertCircle,
} from "lucide-react";

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
  const [enrollLoading, setEnrollLoading] = useState(false);

  // Chuyển đổi cấp độ khóa học sang tiếng Việt
  const levelToLabel = (level) => {
    if (!level) return "";
    const value = String(level).toLowerCase();
    if (value.includes("begin")) return "Khóa học sơ cấp";
    if (value.includes("inter")) return "Khóa học trung cấp";
    if (value.includes("adv")) return "Khóa học cao cấp";
    return level;
  };

  // Tính tổng số chương, bài học và thời lượng
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

  // Định dạng phút sang giờ và phút
  const formatMinutes = (minutes) => {
    if (!minutes || !Number.isFinite(minutes) || minutes <= 0) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs} giờ ${mins} phút`;
    if (hrs > 0) return `${hrs} giờ`;
    return `${mins} phút`;
  };

  // Định dạng hiển thị giá tiền
  const formatPrice = (price) => {
    if (!price || price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Định dạng ngày tháng theo tiếng Việt
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Kiểm tra khóa học có miễn phí không
  const isCourseFree = () => {
    if (!course) return false;

    // Điều kiện 1: Giá bằng 0 hoặc null/undefined
    if (
      course.coursePrice === 0 ||
      course.coursePrice === "0" ||
      course.coursePrice === null ||
      course.coursePrice === undefined
    ) {
      return true;
    }

    // Điều kiện 2: Giá là string có thể parse về 0
    if (typeof course.coursePrice === "string") {
      const numPrice = parseFloat(course.coursePrice);
      return isNaN(numPrice) || numPrice === 0;
    }

    // Điều kiện 3: Trường isFree là true (nếu có)
    if (course.isFree === true || course.isFree === "true") {
      return true;
    }

    return false;
  };

  // Lấy dữ liệu khóa học khi component được mount
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin chi tiết khóa học
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // Lấy các chương và bài học
        const sectionsData = await sectionService.getSectionsByCourseId(
          courseId
        );
        setSections(sectionsData);

        // Lấy đánh giá khóa học
        const reviewsData = await courseService.getCourseReviews(
          courseId,
          0,
          10
        );
        setReviews(reviewsData.content || reviewsData || []);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError("Không thể tải thông tin khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Xử lý đăng ký khóa học miễn phí
  const handleFreeEnrollment = async () => {
    try {
      setEnrollLoading(true);

      // Gọi API đăng ký khóa học miễn phí
      await enrollCourse(courseId);

      // Lưu courseId vào localStorage cho trang kết quả thanh toán
      try {
        localStorage.setItem("lastCourseId", String(courseId));
        localStorage.setItem("lastEnrollmentTime", Date.now().toString());
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      // Chuyển hướng đến trang kết quả thanh toán với trạng thái thành công
      window.location.href = "/payment/result?status=success";
    } catch (err) {
      console.error("Enroll free course error:", err);

      // Xử lý các lỗi cụ thể
      if (err.isPaymentRequired) {
        alert(
          "Khóa học này có phí. Vui lòng sử dụng nút 'Đăng ký ngay' để thanh toán."
        );
      } else if (err.isAlreadyEnrolled) {
        alert("Bạn đã đăng ký khóa học này rồi!");
        window.location.href = `/course/${courseId}/learn`;
      } else {
        alert(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  // Trạng thái loading
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

  // Trạng thái lỗi
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

  const { totalLessons } = getTotals();
  const freeStatus = isCourseFree();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Nội dung bên trái */}
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
                {freeStatus && (
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                    Miễn phí
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.courseName}</h1>
              <p className="text-xl mb-6 text-white/90">
                {totalLessons} bài học
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

            {/* Bên phải - Card khóa học */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
                <div className="relative">
                  <img
                    src={course.courseImageUrl || "/placeholder-course.jpg"}
                    alt={course.courseName}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-primary-500">
                      {formatPrice(course.coursePrice)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
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
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Chia sẻ"
                      >
                        <Share2 className="text-gray-400" size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Nút đăng ký */}
                  {freeStatus ? (
                    <button
                      onClick={handleFreeEnrollment}
                      disabled={enrollLoading}
                      className="block w-full bg-green-600 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader className="animate-spin mr-2" size={20} />
                          Đang xử lý...
                        </span>
                      ) : (
                        "Đăng ký miễn phí"
                      )}
                    </button>
                  ) : (
                    <Link
                      to={`/checkout?courseId=${courseId}`}
                      className="block w-full bg-primary-500 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors mb-4"
                      onClick={() => {
                        try {
                          localStorage.setItem(
                            "lastCourseId",
                            String(courseId)
                          );
                        } catch (e) {
                          console.warn("Could not save to localStorage:", e);
                        }
                      }}
                    >
                      Đăng ký ngay
                    </Link>
                  )}

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

      {/* Nội dung khóa học - Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Nội dung bên trái - Tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                {/* Điều hướng tabs */}
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

                {/* Nội dung tabs */}
                <div className="p-8">
                  {/* Tab Tổng quan - Mô tả khóa học */}
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

                  {/* Tab Nội dung - Các chương và bài học */}
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

                          {/* Danh sách bài học khi mở rộng */}
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

                  {/* Tab Đánh giá - Đánh giá từ học viên */}
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

            {/* Sidebar bên phải - Thông tin khóa học */}
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
