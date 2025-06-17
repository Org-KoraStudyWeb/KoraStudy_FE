import react, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ExamCard from '../components/ExamCard';

const Exams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sample exam data
  const examData = [
    {
      id: 1,
      title: "TOPIK I - Test 1",
      subtitle: "Bài thi thử TOPIK I cơ bản",
      level: "Sơ cấp",
      duration: "100 phút",
      questions: 70,
      participants: 1234,
      rating: 4.8,
      type: "TOPIK I",
      difficulty: "Dễ",
      image: "topik.png",
      price: "Miễn phí"
    },
    {
      id: 2,
      title: "TOPIK I - Test 2",
      subtitle: "Bài thi thử TOPIK I nâng cao",
      level: "Sơ cấp",
      duration: "100 phút",
      questions: 70,
      participants: 987,
      rating: 4.7,
      type: "TOPIK I",
      difficulty: "Trung bình",
      image: "topik.png",
      price: "Miễn phí"
    },
    {
      id: 3,
      title: "TOPIK II - Test 1",
      subtitle: "Bài thi thử TOPIK II cơ bản",
      level: "Trung cấp",
      duration: "180 phút",
      questions: 50,
      participants: 756,
      rating: 4.9,
      type: "TOPIK II",
      difficulty: "Khó",
      image: "topik.png",
      price: "50,000đ"
    },
    {
      id: 4,
      title: "TOPIK II - Test 2",
      subtitle: "Bài thi thử TOPIK II nâng cao",
      level: "Cao cấp",
      duration: "180 phút",
      questions: 50,
      participants: 543,
      rating: 4.6,
      type: "TOPIK II",
      difficulty: "Rất khó",
      image: "topik.png",
      price: "50,000đ"
    },
    {
      id: 5,
      title: "Ngữ pháp cơ bản",
      subtitle: "Kiểm tra ngữ pháp tiếng Hàn cơ bản",
      level: "Sơ cấp",
      duration: "45 phút",
      questions: 30,
      participants: 2156,
      rating: 4.5,
      type: "Ngữ pháp",
      difficulty: "Dễ",
      image: "topik.png",
      price: "Miễn phí"
    },
    {
      id: 6,
      title: "Từ vựng nâng cao",
      subtitle: "Kiểm tra từ vựng tiếng Hàn nâng cao",
      level: "Trung cấp",
      duration: "60 phút",
      questions: 40,
      participants: 1432,
      rating: 4.7,
      type: "Từ vựng",
      difficulty: "Trung bình",
      image: "topik.png",
      price: "30,000đ"
    },
    {
      id: 7,
      title: "Luyện nghe TOPIK I",
      subtitle: "Bài tập luyện nghe cho TOPIK I",
      level: "Sơ cấp",
      duration: "30 phút",
      questions: 30,
      participants: 1876,
      rating: 4.6,
      type: "Luyện nghe",
      difficulty: "Trung bình",
      image: "topik.png",
      price: "Miễn phí"
    },
    {
      id: 8,
      title: "Luyện đọc TOPIK II",
      subtitle: "Bài tập luyện đọc cho TOPIK II",
      level: "Trung cấp",
      duration: "70 phút",
      questions: 25,
      participants: 965,
      rating: 4.8,
      type: "Luyện đọc",
      difficulty: "Khó",
      image: "topik.png",
      price: "40,000đ"
    }
  ];

  const levels = [
    { id: 'all', name: 'Tất cả cấp độ' },
    { id: 'beginner', name: 'Sơ cấp' },
    { id: 'intermediate', name: 'Trung cấp' },
    { id: 'advanced', name: 'Cao cấp' }
  ];

  const examTypes = [
    { id: 'all', name: 'Tất cả loại' },
    { id: 'topik1', name: 'TOPIK I' },
    { id: 'topik2', name: 'TOPIK II' },
    { id: 'grammar', name: 'Ngữ pháp' },
    { id: 'vocabulary', name: 'Từ vựng' },
    { id: 'listening', name: 'Luyện nghe' },
    { id: 'reading', name: 'Luyện đọc' }
  ];

  // Filter exams based on search and filters
  const filteredExams = examData.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || 
                        (selectedLevel === 'beginner' && exam.level === 'Sơ cấp') ||
                        (selectedLevel === 'intermediate' && exam.level === 'Trung cấp') ||
                        (selectedLevel === 'advanced' && exam.level === 'Cao cấp');
    const matchesType = selectedType === 'all' || exam.type.toLowerCase().includes(selectedType.toLowerCase());
    
    return matchesSearch && matchesLevel && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="font-inter font-bold text-4xl lg:text-5xl mb-4">
              Thư viện đề thi
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Luyện tập với hàng trăm đề thi thử TOPIK và bài kiểm tra chuyên sâu
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi, bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-0 text-gray-800 placeholder-gray-500 text-lg outline-none focus:ring-4 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-primary-500" />
                  <h3 className="font-semibold text-lg text-gray-800">Bộ lọc</h3>
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

                {/* Type Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Loại bài thi</h4>
                  <div className="space-y-2">
                    {examTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                          selectedType === type.id 
                            ? 'bg-primary-500 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-4 text-white text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Luyện tập hàng ngày</h4>
                  <p className="text-sm mb-3 opacity-90">Tạo lịch học và nhận nhắc nhở</p>
                  <Link 
                    to="/dang-ky"
                    className="bg-white text-primary-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    Tạo lịch học
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Đề thi và bài kiểm tra
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Tìm thấy {filteredExams.length} kết quả
                  </p>
                </div>
              </div>

              {/* Exams Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {currentExams.map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentPage === index + 1
                          ? 'bg-primary-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
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
            Sẵn sàng chinh phục TOPIK?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Đăng ký tài khoản để truy cập tất cả đề thi và theo dõi tiến độ học tập
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dang-ky"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              Đăng ký miễn phí
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

      <Footer />
    </div>
  );
};

export default Exams;
