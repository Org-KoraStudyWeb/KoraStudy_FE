import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Play, 
  Filter,
  Search,
  ArrowRight,
  Award,
  Target,
  TrendingUp,
  Loader
} from 'lucide-react';
import courseService from '../../api/courseService';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllPublishedCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = [
    { id: 'all', name: 'Tất cả', count: 0 },
    { id: 'topik1', name: 'TOPIK I', count: 0 },
    { id: 'topik2', name: 'TOPIK II', count: 0 },
    { id: 'grammar', name: 'Ngữ pháp', count: 0 },
    { id: 'vocabulary', name: 'Từ vựng', count: 0 },
    { id: 'speaking', name: 'Giao tiếp', count: 0 },
    { id: 'writing', name: 'Viết', count: 0 }
  ];

  // Cập nhật số lượng khóa học trong từng danh mục
  useEffect(() => {
    if (courses.length > 0) {
      const updatedCategories = categories.map(category => {
        if (category.id === 'all') {
          return { ...category, count: courses.length };
        }
        
        const count = courses.filter(course => 
          course.category === category.id
        ).length;
        
        return { ...category, count };
      });
      
      // Không cập nhật state categories vì nó có thể gây re-render không cần thiết
    }
  }, [courses]);

  const levels = [
    { id: 'all', name: 'Tất cả cấp độ' },
    { id: 'beginner', name: 'Sơ cấp (1-2)' },
    { id: 'intermediate', name: 'Trung cấp (3-4)' },
    { id: 'advanced', name: 'Cao cấp (5-6)' }
  ];

  // Mẫu dữ liệu khóa học nổi bật
  const featuredCourses = [
    {
      id: 1,
      title: "TOPIK I - Khóa học cơ bản",
      description: "Khóa học dành cho người mới bắt đầu học tiếng Hàn",
      instructor: "Cô Minh Anh",
      rating: 4.9,
      students: 2847,
      duration: "12 tuần",
      lessons: 48,
      level: "Sơ cấp",
      price: "Miễn phí",
      originalPrice: null,
      image: "topik.png",
      category: "topik1",
      featured: true,
      tags: ["Phổ biến", "Miễn phí"]
    },
    {
      id: 2,
      title: "TOPIK II - Nâng cao kỹ năng",
      description: "Phát triển kỹ năng tiếng Hàn từ trung cấp đến cao cấp, chuẩn bị cho TOPIK II",
      instructor: "Thầy Đức Nam",
      rating: 4.8,
      students: 1923,
      duration: "16 tuần",
      lessons: 64,
      level: "Trung cấp",
      price: "299,000đ",
      originalPrice: "499,000đ",
      image: "topik.png",
      category: "topik2",
      featured: true,
      tags: ["Bán chạy", "Giảm giá"]
    },
    {
      id: 3,
      title: "Ngữ pháp tiếng Hàn từ A-Z",
      description: "Hệ thống hóa toàn bộ ngữ pháp tiếng Hàn từ cơ bản đến nâng cao",
      instructor: "Cô Thu Hà",
      rating: 4.7,
      students: 1456,
      duration: "10 tuần",
      lessons: 40,
      level: "Tất cả",
      price: "199,000đ",
      originalPrice: "299,000đ",
      image: "topik.png",
      category: "grammar",
      featured: false,
      tags: ["Mới"]
    }
  ];
      title: "Từ vựng TOPIK theo chủ đề",
      description: "Học từ vựng tiếng Hàn theo chủ đề, phù hợp cho thi TOPIK",
      instructor: "Cô Lan Anh",
      rating: 4.6,
      students: 987,
      duration: "8 tuần",
      lessons: 32,
      level: "Trung cấp",
      price: "149,000đ",
      originalPrice: null,
      image: "topik.png",
      category: "vocabulary",
      featured: false,
      tags: []
    },
    {
      id: 5,
      title: "Giao tiếp tiếng Hàn hàng ngày",
      description: "Luyện tập giao tiếp tiếng Hàn trong các tình huống thực tế",
      instructor: "Thầy Min Jun",
      rating: 4.8,
      students: 756,
      duration: "6 tuần",
      lessons: 24,
      level: "Sơ cấp",
      price: "179,000đ",
      originalPrice: null,
      image: "topik.png",
      category: "speaking",
      featured: false,
      tags: ["Thực hành"]
    },
    {
      id: 6,
      title: "Luyện viết tiếng Hàn TOPIK",
      description: "Nâng cao kỹ năng viết tiếng Hàn cho kỳ thi TOPIK II",
      instructor: "Cô Hye Jin",
      rating: 4.5,
      students: 543,
      duration: "4 tuần",
      lessons: 16,
      level: "Cao cấp",
      price: "249,000đ",
      originalPrice: null,
      image: "topik.png",
      category: "writing",
      featured: false,
      tags: []
    }
  ];

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Nếu searchTerm trống, lấy lại tất cả khóa học
      try {
        setLoading(true);
        const data = await courseService.getAllPublishedCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const data = await courseService.searchCourses(searchTerm);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError("Không thể tìm kiếm khóa học. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || (course.category && course.category === selectedCategory);
    const matchesLevel = selectedLevel === 'all' || (course.level && 
      ((selectedLevel === 'beginner' && course.level === 'Sơ cấp') ||
      (selectedLevel === 'intermediate' && course.level === 'Trung cấp') ||
      (selectedLevel === 'advanced' && course.level === 'Cao cấp')));
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });



const CourseCard = ({ course, featured = false }) => (
  <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${featured ? 'border-2 border-primary-500' : ''}`}>
    {featured && (
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center py-2 text-sm font-semibold">
        ⭐ Khóa học nổi bật
      </div>
    )}
    
    <Link to={`/course/${course.id}`} className="block">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {course.tags && course.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Play size={16} className="text-primary-500" />
        </div>
      </div>
    </Link>

    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          {course.level}
        </span>
        <span className="text-gray-500 text-sm">{course.category}</span>
      </div>

      <Link to={`/course/${course.id}`}>
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-primary-500 transition-colors">
          {course.title}
        </h3>
      </Link>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
        {course.description}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <img 
          src="/api/placeholder/32/32" 
          alt={course.instructor}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-700 text-sm font-medium">{course.instructor}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Price and Button Section - Fixed at bottom */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-500">{course.price}</span>
            {course.originalPrice && (
              <span className="text-gray-400 line-through text-sm">{course.originalPrice}</span>
            )}
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>{course.lessons} bài học</div>
          </div>
        </div>
        
        <Link 
          to={`/course/${course.id}`}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm font-semibold"
        >
          Xem chi tiết
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </div>
);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="font-inter font-bold text-5xl mb-4">
              Khóa học tiếng Hàn
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Hơn 20+ khóa học chất lượng cao từ cơ bản đến nâng cao
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-lg outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <BookOpen className="w-12 h-12 text-primary-500 mb-3" />
              <div className="text-3xl font-bold text-gray-800">20+</div>
              <div className="text-gray-600">Khóa học</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-primary-500 mb-3" />
              <div className="text-3xl font-bold text-gray-800">10,000+</div>
              <div className="text-gray-600">Học viên</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-primary-500 mb-3" />
              <div className="text-3xl font-bold text-gray-800">95%</div>
              <div className="text-gray-600">Tỷ lệ đậu</div>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="w-12 h-12 text-primary-500 mb-3" />
              <div className="text-3xl font-bold text-gray-800">4.8/5</div>
              <div className="text-gray-600">Đánh giá</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Filter size={20} />
                  Bộ lọc
                </h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Danh mục</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex justify-between items-center ${
                          selectedCategory === category.id 
                            ? 'bg-primary-500 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-sm opacity-75">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Cấp độ</h4>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                          selectedLevel === level.id 
                            ? 'bg-primary-500 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-4 text-white text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Không biết chọn gì?</h4>
                  <p className="text-sm mb-3 opacity-90">Làm bài test trình độ để tìm khóa học phù hợp</p>
                  <Link 
                    to="/dang-ky"
                    className="bg-white text-primary-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    Làm bài test
                  </Link>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Tìm thấy {filteredCourses.length} khóa học
                </h2>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Sắp xếp theo</option>
                  <option>Phổ biến nhất</option>
                  <option>Mới nhất</option>
                  <option>Giá thấp đến cao</option>
                  <option>Giá cao đến thấp</option>
                  <option>Đánh giá cao nhất</option>
                </select>
              </div>

              {/* Featured Courses */}
              {selectedCategory === 'all' && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Khóa học nổi bật</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredCourses.filter(course => course.featured).map(course => (
                      <CourseCard key={course.id} course={course} featured={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Courses */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {/* No Results */}
              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Không tìm thấy khóa học nào
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLevel('all');
                      setSearchTerm('');
                    }}
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-inter font-bold text-3xl text-white mb-4">
            Bắt đầu học tiếng Hàn ngay hôm nay
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Đăng ký tài khoản để truy cập tất cả khóa học và tính năng học tập
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dang-ky"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              Đăng ký miễn phí
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/dang-nhap"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
