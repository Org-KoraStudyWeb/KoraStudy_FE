import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
//   Award,
  CheckCircle,
  BookOpen,
//   Download,
  Share2,
  Heart,
  ChevronDown,
  ChevronUp,
  Globe,
//   Calendar,
//   Target,
//   TrendingUp
} from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock course data - in real app, this would come from API
  const courseData = {
    1: {
      id: 1,
      title: "TOPIK I - Khóa học cơ bản",
      subtitle: "Khóa học dành cho người mới bắt đầu học tiếng Hàn",
      description: "Khóa học toàn diện dành cho người mới bắt đầu học tiếng Hàn, từ việc học bảng chữ cái Hangeul đến chuẩn bị cho kỳ thi TOPIK I. Với phương pháp giảng dạy hiện đại và tương tác, bạn sẽ nắm vững các kỹ năng cơ bản của tiếng Hàn.",
      instructor: {
        name: "Minh Anh",
        title: "Giảng viên tiếng Hàn",
        experience: "5+ năm kinh nghiệm",
        avatar: "",
        bio: " Minh Anh có hơn 5 năm kinh nghiệm giảng dạy tiếng Hàn và đã giúp hàng nghìn học viên đạt được mục tiêu TOPIK của mình."
      },
      rating: 4.9,
      totalRatings: 2847,
      students: 12543,
      duration: "12 tuần",
      totalHours: "48 giờ",
      lessons: 48,
      level: "Sơ cấp",
      language: "Tiếng Việt",
      price: "Miễn phí",
      originalPrice: null,
      image: "topik.png",
      category: "TOPIK I",
      tags: ["Phổ biến", "Miễn phí", "Chứng chỉ"],
      lastUpdated: "Tháng 12, 2024",
      features: [
        "48 bài học video chất lượng cao",
        "Tài liệu PDF có thể tải xuống",
        "Bài tập thực hành sau mỗi bài học",
        "Đề thi thử TOPIK I",
        "Hỗ trợ trực tuyến từ giảng viên",
        "Chứng chỉ hoàn thành khóa học",
        "Truy cập trọn đời",
        "Học trên mọi thiết bị"
      ],
      requirements: [
        "Không cần kiến thức tiếng Hàn trước đó",
        "Máy tính hoặc điện thoại có kết nối internet",
        "Sự kiên trì và động lực học tập"
      ],
      outcomes: [
        "Đọc và viết được bảng chữ cái Hangeul",
        "Giao tiếp cơ bản trong các tình huống hàng ngày",
        "Hiểu và sử dụng 800+ từ vựng cơ bản",
        "Nắm vững ngữ pháp cơ bản của tiếng Hàn",
        "Sẵn sàng cho kỳ thi TOPIK I",
        "Tự tin giao tiếp với người Hàn Quốc"
      ]
    },
    2: {
      id: 2,
      title: "TOPIK II - Nâng cao kỹ năng",
      subtitle: "Phát triển kỹ năng tiếng Hàn từ trung cấp đến cao cấp",
      description: "Khóa học nâng cao dành cho những ai đã có nền tảng tiếng Hàn và muốn phát triển kỹ năng lên trình độ trung cấp - cao cấp để chuẩn bị cho kỳ thi TOPIK II.",
      instructor: {
        name: "Thầy Đức Nam",
        title: "Chuyên gia TOPIK",
        experience: "8+ năm kinh nghiệm",
        avatar: "/api/placeholder/80/80",
        bio: "Thầy Đức Nam là chuyên gia về kỳ thi TOPIK với hơn 8 năm kinh nghiệm và tỷ lệ học viên đậu 95%."
      },
      rating: 4.8,
      totalRatings: 1923,
      students: 8765,
      duration: "16 tuần",
      totalHours: "64 giờ",
      lessons: 64,
      level: "Trung cấp",
      language: "Tiếng Việt",
      price: "299,000đ",
      originalPrice: "499,000đ",
      image: "topik.png",
      category: "TOPIK II",
      tags: ["Bán chạy", "Giảm giá", "Chứng chỉ"],
      lastUpdated: "Tháng 12, 2024",
      features: [
        "64 bài học video chuyên sâu",
        "Tài liệu học tập đầy đủ",
        "Đề thi thử TOPIK II định kỳ",
        "Chấm bài viết cá nhân",
        "Lớp học trực tuyến hàng tuần",
        "Hỗ trợ 1-1 với giảng viên"
      ],
      requirements: [
        "Đã hoàn thành TOPIK I hoặc có trình độ tương đương",
        "Hiểu được ngữ pháp cơ bản tiếng Hàn",
        "Có thể đọc và viết Hangeul thành thạo"
      ],
      outcomes: [
        "Đạt điểm cao trong kỳ thi TOPIK II",
        "Giao tiếp thành thạo trong môi trường học tập/làm việc",
        "Hiểu và sử dụng 3000+ từ vựng nâng cao",
        "Viết được các bài luận phức tạp",
        "Đọc hiểu các văn bản chuyên môn"
      ]
    }
  };

  const course = courseData[courseId] || courseData[1];

  const curriculum = [
    {
      id: 1,
      title: "Chương 1: Làm quen với tiếng Hàn",
      duration: "8 bài học • 3 giờ",
      lessons: [
        { id: 1, title: "Giới thiệu về tiếng Hàn", duration: "15:30", type: "video", free: true },
        { id: 2, title: "Bảng chữ cái Hangeul - Phần 1", duration: "22:45", type: "video", free: true },
        { id: 3, title: "Bảng chữ cái Hangeul - Phần 2", duration: "20:15", type: "video", free: false },
        { id: 4, title: "Cách phát âm chuẩn", duration: "18:30", type: "video", free: false },
        { id: 5, title: "Bài tập thực hành", duration: "25:00", type: "exercise", free: false }
      ]
    },
    {
      id: 2,
      title: "Chương 2: Ngữ pháp cơ bản",
      duration: "12 bài học • 4.5 giờ",
      lessons: [
        { id: 6, title: "Cấu trúc câu cơ bản", duration: "20:00", type: "video", free: false },
        { id: 7, title: "Động từ và tính từ", duration: "25:30", type: "video", free: false },
        { id: 8, title: "Thì hiện tại", duration: "18:45", type: "video", free: false }
      ]
    },
    {
      id: 3,
      title: "Chương 3: Từ vựng thông dụng",
      duration: "10 bài học • 3.5 giờ",
      lessons: [
        { id: 9, title: "Từ vựng gia đình", duration: "15:20", type: "video", free: false },
        { id: 10, title: "Từ vựng thực phẩm", duration: "17:30", type: "video", free: false }
      ]
    }
  ];

  const reviews = [
    {
      id: 1,
      user: "Nguyễn Thị Lan",
      avatar: "/api/placeholder/50/50",
      rating: 5,
      date: "2 tuần trước",
      comment: "Khóa học rất hay và dễ hiểu. Minh Anh giảng dạy rất tận tình và chi tiết. Sau 3 tháng học, mình đã có thể giao tiếp cơ bản được rồi!"
    },
    {
      id: 2,
      user: "Trần Văn Nam",
      avatar: "/api/placeholder/50/50",
      rating: 5,
      date: "1 tháng trước",
      comment: "Nội dung khóa học được sắp xếp logic, từ dễ đến khó. Đặc biệt là phần phát âm được hướng dẫn rất kỹ lưỡng."
    },
    {
      id: 3,
      user: "Lê Thị Hoa",
      avatar: "/api/placeholder/50/50",
      rating: 4,
      date: "2 tháng trước",
      comment: "Khóa học tốt, giá cả hợp lý. Tuy nhiên mình mong muốn có thêm nhiều bài tập thực hành hơn nữa."
    }
  ];

  const relatedCourses = [
    {
      id: 2,
      title: "TOPIK II - Nâng cao kỹ năng",
      instructor: "Thầy Đức Nam",
      rating: 4.8,
      students: 1923,
      price: "299,000đ",
      image: "/topik.png"
    },
    {
      id: 3,
      title: "Ngữ pháp tiếng Hàn từ A-Z",
      instructor: "Cô Thu Hà",
      rating: 4.7,
      students: 1456,
      price: "199,000đ",
      image: "/topik.png"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: <BookOpen size={16} /> },
    { id: 'curriculum', label: 'Nội dung khóa học', icon: <Play size={16} /> },
    { id: 'instructor', label: 'Giảng viên', icon: <Users size={16} /> },
    { id: 'reviews', label: 'Đánh giá', icon: <Star size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-500">Trang chủ</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-primary-500">Khóa học</Link>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-secondary-400 to-secondary-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Content */}
            <div className="flex-1 text-white">
              <Link 
                to="/courses"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                Quay lại danh sách khóa học
              </Link>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 text-white/90">{course.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-white/80">({course.totalRatings.toLocaleString()} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>{course.students.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{course.totalHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{course.instructor.name}</div>
                  <div className="text-white/80 text-sm">{course.instructor.title}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-white/20 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Content - Course Card */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
                <div className="relative">
                  <img 
                    src={`/${course.image}`} 
                    alt={course.title}
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
                    <div>
                      <div className="text-3xl font-bold text-primary-500">{course.price}</div>
                      {course.originalPrice && (
                        <div className="text-gray-400 line-through">{course.originalPrice}</div>
                      )}
                    </div>
                    <button 
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart 
                        className={`${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                        size={20} 
                      />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Link 
                      to="/dang-nhap"
                      className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors font-semibold text-center block"
                    >
                      Đăng ký học ngay
                    </Link>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                      Thêm vào giỏ hàng
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    Đảm bảo hoàn tiền trong 30 ngày
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={16} />
                      <span>Truy cập trọn đời</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={16} />
                      <span>Học trên mọi thiết bị</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" size={16} />
                      <span>Chứng chỉ hoàn thành</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <button className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors">
                      <Share2 size={16} />
                      Chia sẻ khóa học
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="border-b">
                  <div className="flex overflow-x-auto">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'text-primary-500 border-b-2 border-primary-500'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Mô tả khóa học</h3>
                        <p className="text-gray-700 leading-relaxed">{course.description}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Bạn sẽ học được gì?</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {course.outcomes.map((outcome, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                              <span className="text-gray-700">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Yêu cầu</h3>
                        <ul className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Khóa học bao gồm</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {course.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="text-primary-500 mt-1 flex-shrink-0" size={16} />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Curriculum Tab */}
                  {activeTab === 'curriculum' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Nội dung khóa học</h3>
                        <div className="text-sm text-gray-600">
                          {course.lessons} bài học • {course.totalHours}
                        </div>
                      </div>

                      {curriculum.map(module => (
                        <div key={module.id} className="border rounded-lg">
                          <button
                            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div>
                              <h4 className="font-semibold">{module.title}</h4>
                              <p className="text-sm text-gray-600">{module.duration}</p>
                            </div>
                            {expandedModule === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>

                          {expandedModule === module.id && (
                            <div className="border-t">
                              {module.lessons.map(lesson => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                                  <div className="flex items-center gap-3">
                                    <Play className="text-gray-400" size={16} />
                                    <span className="text-gray-700">{lesson.title}</span>
                                    {lesson.free && (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                        Miễn phí
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Instructor Tab */}
                  {activeTab === 'instructor' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-6">
                        <img 
                          src={course.instructor.avatar} 
                          alt={course.instructor.name}
                          className="w-24 h-24 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold mb-2">{course.instructor.name}</h3>
                          <p className="text-gray-600 mb-2">{course.instructor.title}</p>
                          <p className="text-gray-600 mb-4">{course.instructor.experience}</p>
                          <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary-500 mb-1">4.9</div>
                          <div className="text-sm text-gray-600">Đánh giá trung bình</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary-500 mb-1">15,000+</div>
                          <div className="text-sm text-gray-600">Học viên</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary-500 mb-1">12</div>
                          <div className="text-sm text-gray-600">Khóa học</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary-500 mb-2">{course.rating}</div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="text-yellow-400 fill-current" size={16} />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">{course.totalRatings.toLocaleString()} đánh giá</div>
                        </div>
                        
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-3 mb-2">
                              <span className="text-sm w-8">{rating} ⭐</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : '5%' }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        {reviews.map(review => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start gap-4">
                              <img 
                                src={review.avatar} 
                                alt={review.user}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold">{review.user}</h4>
                                  <div className="flex items-center gap-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                      <Star key={i} className="text-yellow-400 fill-current" size={14} />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-80">
              <div className="space-y-6">
                {/* Course Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold mb-4">Thông tin khóa học</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cập nhật lần cuối:</span>
                      <span>{course.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngôn ngữ:</span>
                      <span>{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span>{course.totalHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số bài học:</span>
                      <span>{course.lessons} bài</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cấp độ:</span>
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>

                {/* Related Courses */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold mb-4">Khóa học liên quan</h3>
                  <div className="space-y-4">
                    {relatedCourses.map(relatedCourse => (
                      <Link 
                        key={relatedCourse.id}
                        to={`/course/${relatedCourse.id}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <img 
                            src={relatedCourse.image} 
                            alt={relatedCourse.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm group-hover:text-primary-500 transition-colors line-clamp-2">
                              {relatedCourse.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">{relatedCourse.instructor}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="text-yellow-400 fill-current" size={12} />
                                <span className="text-xs">{relatedCourse.rating}</span>
                              </div>
                              <span className="text-sm font-semibold text-primary-500">
                                {relatedCourse.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
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

export default CourseDetail;
