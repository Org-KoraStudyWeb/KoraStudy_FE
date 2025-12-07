import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Star,
} from "lucide-react";
import DOMPurify from "dompurify";
import enrollmentService from "../../api/enrollmentService";
import courseService from "../../api/courseService";
import { useUser } from "../../contexts/UserContext";
import { formatDate } from "../../utils/formatDate";

const MyCoursesPage = () => {
  const { isAuthenticated, user } = useUser();
  const [enrollments, setEnrollments] = useState([]);
  const [coursesData, setCoursesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isAuthenticated) {
          console.log("User not authenticated, skipping enrollment fetch");
          setLoading(false);
          return;
        }

        console.log("Fetching enrollments...");
        const enrollmentsData = await enrollmentService.getMyEnrollments();
        console.log("Enrollments data:", enrollmentsData);
        setEnrollments(enrollmentsData || []);

        // Fetch thông tin chi tiết cho từng khóa học
        if (enrollmentsData && enrollmentsData.length > 0) {
          const coursesInfo = {};

          for (const enrollment of enrollmentsData) {
            try {
              // Fetch course details
              const courseDetail = await courseService.getCourseById(
                enrollment.courseId
              );
              coursesInfo[enrollment.courseId] = courseDetail;
            } catch (err) {
              console.error(
                `Error fetching course ${enrollment.courseId}:`,
                err
              );
              // Fallback: sử dụng dữ liệu từ enrollment nếu có
              coursesInfo[enrollment.courseId] = {
                courseName: enrollment.courseName,
                courseDescription: enrollment.courseDescription,
                courseImageUrl: enrollment.courseImageUrl,
                courseLevel: enrollment.courseLevel,
                totalDuration: enrollment.totalDuration,
                totalLessons: enrollment.totalLessons,
                enrollmentCount: enrollment.enrollmentCount,
                averageRating: enrollment.averageRating,
                reviewCount: enrollment.reviewCount,
              };
            }
          }
          setCoursesData(coursesInfo);
        }
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        const friendly =
          err?.message ||
          err?.data ||
          JSON.stringify(err) ||
          "Không thể tải danh sách khóa học. Vui lòng thử lại sau.";
        setError(friendly);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isAuthenticated]);

  // Hàm lấy thông tin khóa học
  const getCourseInfo = (enrollment) => {
    const courseDetail = coursesData[enrollment.courseId] || {};

    const getDurationInfo = () => {
      // Duration display removed by request — return empty string
      return "";
    };

    return {
      title:
        courseDetail.courseName ||
        enrollment.courseName ||
        "Khóa học không tên",
      description:
        courseDetail.courseDescription ||
        enrollment.courseDescription ||
        "Không có mô tả",
      thumbnail:
        courseDetail.courseImageUrl ||
        enrollment.courseImageUrl ||
        "/api/placeholder/400/200",
      duration: getDurationInfo(),
      level: courseDetail.courseLevel || enrollment.courseLevel,
      totalLessons: courseDetail.totalLessons || enrollment.totalLessons || 0,
      enrollmentCount:
        courseDetail.enrollmentCount || enrollment.enrollmentCount || 0,
      averageRating:
        courseDetail.averageRating || enrollment.averageRating || 0,
      reviewCount: courseDetail.reviewCount || enrollment.reviewCount || 0,
      id: enrollment.courseId,
    };
  };

  // Hàm format minutes thành giờ/phút
  const formatMinutes = (minutes) => {
    if (!minutes || !Number.isFinite(minutes) || minutes <= 0) return "";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs} giờ ${mins} phút`;
    if (hrs > 0) return `${hrs} giờ`;
    return `${mins} phút`;
  };

  // Hàm format level
  const levelToLabel = (level) => {
    if (!level) return "";
    const value = String(level).toLowerCase();
    if (
      value.includes("begin") ||
      value.includes("cơ bản") ||
      value.includes("sơ cấp")
    )
      return "Sơ cấp";
    if (value.includes("inter") || value.includes("trung cấp"))
      return "Trung cấp";
    if (
      value.includes("adv") ||
      value.includes("nâng cao") ||
      value.includes("cao cấp")
    )
      return "Nâng cao";
    return level;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isAuthenticated ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            Khóa học của tôi
          </h1>
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
          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            Khóa học của tôi
          </h1>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            Khóa học của tôi
          </h1>
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
          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            Khóa học của tôi
          </h1>

          {/* Courses list */}
          {enrollments.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Bạn chưa đăng ký khóa học nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Khám phá các khóa học chất lượng cao để bắt đầu hành trình học
                tập của bạn.
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
              {enrollments.map((enrollment) => {
                const course = getCourseInfo(enrollment);

                return (
                  <div
                    key={enrollment.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/400/200";
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                          <BarChart className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      {/* Level badge */}
                      {course.level && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {levelToLabel(course.level)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Course stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{course.averageRating.toFixed(1)}</span>
                          <span>({course.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrollmentCount}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {(() => {
                          try {
                            const temp = document.createElement("div");
                            temp.innerHTML = DOMPurify.sanitize(
                              course.description || ""
                            );
                            let txt = temp.textContent || temp.innerText || "";
                            txt = txt.replace(/\s+/g, " ").trim();
                            if (txt.length > 180)
                              return txt.slice(0, 180).trim() + "...";
                            return txt;
                          } catch (e) {
                            return course.description || "";
                          }
                        })()}
                      </p>

                      {/* Course stats */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Đăng ký: {formatDate(enrollment.enrollDate)}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          to={`/my-courses/${course.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Vào học
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
