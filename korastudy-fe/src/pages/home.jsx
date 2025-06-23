// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Users, Award, Star, ArrowRight, CheckCircle } from 'lucide-react';
// import { Play, Star, ArrowRight, CheckCircle } from 'lucide-react';

// const iconMap = {
//   BookOpen: <BookOpen className="w-8 h-8" />,
//   Users: <Users className="w-8 h-8" />,
//   Award: <Award className="w-8 h-8" />,
// };

const Home = () => {
  // const [features, setFeatures] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:8080/api/home/features")
  //     .then(res => res.json())
  //     .then(data => {
  //       // Gán icon component dựa vào tên icon trả về từ API
  //       const featuresWithIcon = data.map(item => ({
  //         ...item,
  //         icon: iconMap[item.icon] || <BookOpen className="w-8 h-8" /> // fallback nếu không có icon
  //       }));
  //       setFeatures(featuresWithIcon);
  //     });
  // }, []);
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Tài liệu phong phú",
      description: "Hơn 1000+ tài liệu học tiếng Hàn từ cơ bản đến nâng cao"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cộng đồng học tập",
      description: "Kết nối với hàng nghìn học viên cùng đam mê tiếng Hàn"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Luyện thi TOPIK",
      description: "Đề thi thử và bài luyện tập chuẩn format TOPIK"
    }
  ];
  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      level: "TOPIK 5",
      content: "Nhờ KoraStudy mà mình đã đạt được TOPIK 5 và có cơ hội du học Hàn Quốc. Tài liệu rất chi tiết và dễ hiểu!",
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Trần Thị Hoa",
      level: "TOPIK 4",
      content: "Phương pháp học tại KoraStudy rất hiệu quả. Từ không biết gì về tiếng Hàn, giờ mình đã có thể giao tiếp tự tin.",
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Lê Văn Nam",
      level: "TOPIK 6",
      content: "Đề thi thử của KoraStudy giúp mình chuẩn bị tốt cho kỳ thi TOPIK. Kết quả vượt ngoài mong đợi!",
      avatar: "/api/placeholder/60/60"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Học viên" },
    { number: "1,000+", label: "Tài liệu" },
    { number: "95%", label: "Tỷ lệ đậu TOPIK" },
    { number: "24/7", label: "Hỗ trợ" }
  ];

  const courses = [
    {
      title: "TOPIK I (Level 1-2)",
      description: "Dành cho người mới bắt đầu học tiếng Hàn",
      duration: "3 tháng",
      lessons: "120 bài học",
      price: "Free",
      image: "topik.png"
    //   image: "/api/placeholder/300/200"
    
    },
    {
      title: "TOPIK II (Level 3-6)",
      description: "Nâng cao kỹ năng tiếng Hàn lên trình độ cao",
      duration: "6 tháng",
      lessons: "240 bài học",
      price: "299,000đ",
      image: "/api/placeholder/300/200"
    },
    {
      title: "TOPIK ESP",
      description: "Chuyên sâu cho mục đích học tập và làm việc",
      duration: "4 tháng",
      lessons: "180 bài học",
      price: "499,000đ",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-inter font-bold text-5xl lg:text-6xl leading-tight text-gray-800 mb-6">
                Để tiếng Hàn<br />
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  không còn là trở ngại
                </span>
              </h1>
              <p className="font-inter text-xl text-gray-600 mb-8 leading-relaxed">
                Dễ dàng đạt được Level mong muốn với KoraStudy.com<br />
                Hơn 10,000 học viên đã tin tưởng và thành công
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link 
                  to="/dang-ky"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
                >
                  Bắt đầu học ngay
                  <ArrowRight size={20} />
                </Link>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 transition-all duration-300 hover:border-primary-500 hover:text-primary-500 inline-flex items-center justify-center gap-2">
                  <Play size={20} />
                  Xem demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Miễn phí đăng ký</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Không cam kết dài hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="flex-1 relative">
              <div className="relative z-10">
                <img 
                //src="/api/placeholder/600/500"
                  src="/banner/banner1.png" 
                  alt="Korean Learning Platform" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              {/* Background Decorations */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-500 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-4xl text-gray-800 mb-4">
              Tại sao chọn KoraStudy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp phương pháp học tiếng Hàn hiệu quả nhất với công nghệ hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))} */}
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-4xl text-gray-800 mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lựa chọn khóa học phù hợp với trình độ và mục tiêu của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-800 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{course.duration}</span>
                    <span>{course.lessons}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-500">{course.price}</span>
                    <Link 
                      to="/dang-ky"
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-inter font-bold text-4xl text-white mb-4">
              Học viên nói gì về chúng tôi?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Hàng nghìn học viên đã thành công với KoraStudy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-white/70 text-sm">{testimonial.level}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-inter font-bold text-4xl text-white mb-6">
            Sẵn sàng bắt đầu hành trình học tiếng Hàn?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Tham gia cùng hàng nghìn học viên đã thành công với KoraStudy
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
              to="/lien-he"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;