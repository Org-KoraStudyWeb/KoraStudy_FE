import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  ArrowRight,
  Loader,
  AlertCircle,
} from "lucide-react";
import courseService from "../../api/courseService";
import { getMyEnrollments } from "../../api/enrollmentService";
import { useUser } from "../../contexts/UserContext";
import DOMPurify from "dompurify";
import CourseCard from "../../components/course/CourseCard";

const CoursesNew = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { isAuthenticated } = useUser();

  // Fetch courses from API (exported so listeners can call it)
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllPublishedCourses();

      let visibleCourses = data || [];

      // If user is authenticated, fetch their enrollments and exclude those courses
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
        // if anything fails when fetching enrollments, show full list
        visibleCourses = data || [];
      }

      setCourses(visibleCourses);
      setFilteredCourses(visibleCourses);
    } catch (err) {
      setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

    // Listen for enrollment changes and refresh list
    const handler = (e) => {
      console.log("enrollment:changed event received", e?.detail);
      fetchCourses();
    };
    window.addEventListener("enrollment:changed", handler);
    return () => window.removeEventListener("enrollment:changed", handler);
  }, [isAuthenticated]);

  // Filter courses based on search term and level
  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter(
        (course) => course.courseLevel === selectedLevel
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedLevel, courses]);

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setFilteredCourses(courses);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await courseService.searchCourses(keyword);
      setFilteredCourses(searchResults);
    } catch (err) {
      console.error("Error searching courses:", err);
      // Fallback to client-side filtering (với thuộc tính đúng)
      const filtered = courses.filter(
        (course) =>
          course.courseName?.toLowerCase().includes(keyword.toLowerCase()) ||
          course.courseDescription
            ?.toLowerCase()
            .includes(keyword.toLowerCase())
      );
      setFilteredCourses(filtered);
    } finally {
      setLoading(false);
    }
  };

  const levels = [
    { id: "all", name: "Tất cả cấp độ" },
    { id: "Sơ cấp", name: "Sơ cấp" },
    { id: "Trung cấp", name: "Trung cấp" },
    { id: "Cao cấp", name: "Cao cấp" },
  ];

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
      {/* Header */}
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

      {/* Filters and Search */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchTerm);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Level Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleSearch(searchTerm)}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center gap-2"
              >
                <Search size={20} />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Khóa học ({filteredCourses.length})
            </h2>
          </div>

          {loading && courses.length > 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader className="animate-spin text-primary-500" size={32} />
              <span className="ml-2">Đang tìm kiếm...</span>
            </div>
          )}

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
