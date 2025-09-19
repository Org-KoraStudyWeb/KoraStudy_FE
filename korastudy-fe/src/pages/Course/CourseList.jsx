import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../api/courseService';
import CourseCard from '../../components/LearningPathComponent/CourseCard';
import { useAuth } from '../../contexts/AuthContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user } = useAuth();

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getPublishedCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      // If search term is empty, load all courses
      try {
        setLoading(true);
        const data = await courseService.getPublishedCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const data = await courseService.searchCourses(searchTerm);
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to search courses. Please try again later.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Khóa học</h1>
        {isAuthenticated && user?.roles?.includes('ADMIN') && (
          <Link 
            to="/admin/courses/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Thêm khóa học mới
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Error and loading states */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Courses grid */}
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl dark:text-white">Không tìm thấy khóa học nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
