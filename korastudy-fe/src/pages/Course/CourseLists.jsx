import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Filter, Search, Loader, AlertCircle } from "lucide-react";
import courseService from "../../api/courseService";
import { getMyEnrollments } from "../../api/enrollmentService";
import { useUser } from "../../contexts/UserContext";
import CourseCard from "../../components/course/CourseCard";

const CoursesNew = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { isAuthenticated } = useUser();

  // Mapping level từ database (UPPERCASE) sang tiếng Việt
  const levelMapping = {
    BEGINNER: "Sơ cấp",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Cao cấp",
  };

  // Các level option cho dropdown
  const levelOptions = [
    { id: "all", name: "Tất cả cấp độ" },
    { id: "BEGINNER", name: "Sơ cấp" },
    { id: "INTERMEDIATE", name: "Trung cấp" },
    { id: "ADVANCED", name: "Cao cấp" },
  ];

  // Hàm chuyển đổi level từ database sang tiếng Việt để hiển thị
  const getDisplayLevel = (level) => {
    if (!level || level === "all") return "";

    // Chuyển về uppercase để so sánh với mapping
    const upperLevel = String(level).toUpperCase();

    // Kiểm tra trong mapping
    if (levelMapping[upperLevel]) {
      return levelMapping[upperLevel];
    }

    // Fallback: kiểm tra partial match
    if (upperLevel.includes("BEGINNER") || upperLevel.includes("BEGIN"))
      return "Sơ cấp";
    if (upperLevel.includes("INTERMEDIATE") || upperLevel.includes("INTER"))
      return "Trung cấp";
    if (upperLevel.includes("ADVANCED") || upperLevel.includes("ADV"))
      return "Cao cấp";

    return level;
  };

  // Fetch courses từ API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllPublishedCourses();

      let visibleCourses = data || [];

      // Nếu user đã đăng nhập, lấy danh sách khóa học đã đăng ký và loại bỏ
      try {
        if (isAuthenticated()) {
          const enrollments = await getMyEnrollments();
          const enrolledCourseIds = new Set(
            (enrollments || []).map(
              (e) => e.course?.id || e.courseId || e.course_id
            )
          );
          visibleCourses = (data || []).filter(
            (c) => !enrolledCourseIds.has(c.id)
          );
        }
      } catch (ignore) {
        // Nếu có lỗi khi lấy enrollments, hiển thị toàn bộ danh sách
        visibleCourses = data || [];
      }

      setCourses(visibleCourses);
      setFilteredCourses(visibleCourses);

      // Debug: log các level có trong dữ liệu
      const uniqueLevels = [
        ...new Set(visibleCourses.map((c) => c.courseLevel).filter(Boolean)),
      ];
      console.log("Các level có trong dữ liệu:", uniqueLevels);
    } catch (err) {
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Lắng nghe sự kiện enrollment:changed để refresh danh sách
    const handler = (e) => {
      console.log("enrollment:changed event received", e?.detail);
      fetchCourses();
    };
    window.addEventListener("enrollment:changed", handler);
    return () => window.removeEventListener("enrollment:changed", handler);
  }, [isAuthenticated]);

  // Hàm filter courses dựa trên search term và level
  const filterCourses = (coursesList, search, level) => {
    let filtered = [...coursesList];

    // Filter theo search term
    if (search && search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.courseName?.toLowerCase().includes(term) ||
          course.courseDescription?.toLowerCase().includes(term)
      );
    }

    // Filter theo level (so sánh case-insensitive)
    if (level !== "all") {
      const levelUpper = level.toUpperCase();
      filtered = filtered.filter(
        (course) =>
          course.courseLevel && course.courseLevel.toUpperCase() === levelUpper
      );
    }

    return filtered;
  };

  // Xử lý tìm kiếm
  const handleSearch = async () => {
    try {
      setLoading(true);

      let results = courses;

      // Nếu có search term, gọi API search
      if (searchTerm.trim()) {
        try {
          const searchResults = await courseService.searchCourses(
            searchTerm.trim()
          );
          results = searchResults;
        } catch (err) {
          console.error("Error searching courses:", err);
          // Fallback: filter client-side
          results = courses.filter(
            (course) =>
              course.courseName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              course.courseDescription
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }
      }

      // Áp dụng filter level
      const finalResults = filterCourses(results, searchTerm, selectedLevel);
      setFilteredCourses(finalResults);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi thay đổi level filter
  const handleLevelChange = (level) => {
    console.log("Level selected:", level);
    setSelectedLevel(level);
    const filtered = filterCourses(courses, searchTerm, level);
    console.log("Filtered courses count:", filtered.length);
    setFilteredCourses(filtered);
  };

  // Xử lý khi nhập search term
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      // Nếu xóa search term, filter lại với level hiện tại
      const filtered = filterCourses(courses, "", selectedLevel);
      setFilteredCourses(filtered);
    }
  };

  // Xử lý khi nhấn Enter trong ô search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <Loader className="animate-spin text-primary-500" size={48} />
            <span className="ml-3 text-lg">Đang tải khóa học...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center text-red-500">
            <AlertCircle size={48} />
            <div className="ml-3">
              <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <section className="py-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Khóa học tiếng Hàn</h1>
            <p className="text-xl text-white/90">
              Khám phá và học tập với các khóa học chất lượng cao
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Level Filter Dropdown */}
              <div className="lg:w-64">
                <select
                  value={selectedLevel}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {levelOptions.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center gap-2"
              >
                <Search size={20} />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid Section */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Khóa học ({filteredCourses.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter size={16} />
              <span>
                Level: {getDisplayLevel(selectedLevel) || "Tất cả"}
                {searchTerm && ` | Tìm: "${searchTerm}"`}
              </span>
            </div>
          </div>

          {/* Loading khi đang search */}
          {loading && courses.length > 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-primary-500" size={32} />
              <span className="ml-2">Đang tìm kiếm...</span>
            </div>
          )}

          {/* Không tìm thấy kết quả */}
          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy khóa học
              </h3>
              <p className="text-gray-500">
                Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
              </p>
            </div>
          )}

          {/* Grid hiển thị courses */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesNew;
