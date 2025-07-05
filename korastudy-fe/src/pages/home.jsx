import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Play, BookOpen, Users, Award, Star, ArrowRight, 
  CheckCircle, ChevronLeft, ChevronRight, Sparkles, Zap, Target
} from 'lucide-react';

// Memoized components to prevent unnecessary re-renders
const MemoizedIcon = memo(({ children }) => children);

// Optimized banner component with AnimatePresence
const BannerSlider = memo(({ banners, currentBanner, prevBanner, nextBanner }) => {
  return (
    <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl">
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <img
              src={banners[currentBanner]}
              alt={`Korean Learning Platform - Slide ${currentBanner + 1}`}
              className="w-full h-auto object-cover"
              style={{ willChange: 'transform' }}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
          
        {/* Navigation Arrows with improved performance */}
        <motion.button 
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl z-10 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous banner"
          style={{ willChange: 'transform' }}
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </motion.button>
        
        <motion.button 
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl z-10 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next banner"
          style={{ willChange: 'transform' }}
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </motion.button>
        
        {/* Optimized Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
          {banners.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {}}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentBanner === index ? 'bg-blue-500 w-8' : 'bg-white/60 w-3'
              }`}
              whileHover={{ scale: 1.2 }}
              style={{ willChange: 'transform' }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// Memoized animated section to prevent unnecessary re-renders
const AnimatedSection = memo(({ children, className = "", delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1, margin: "0px 0px 100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = useMemo(() => [
    '/banner/banner1.png',
    '/banner/banner2.png',
    '/banner/banner1.png',
    '/banner/banner2.png'
  ], []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // Optimized banner navigation with useCallback
  const prevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, [banners.length]);
  
  // Auto-slide with proper cleanup and optimization
  useEffect(() => {
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, [nextBanner]);
  
  // Memoized data objects to prevent recreating on every render
  const features = useMemo(() => [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Tài liệu phong phú",
      description: "Hơn 1000+ tài liệu học tiếng Hàn từ cơ bản đến nâng cao",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cộng đồng học tập",
      description: "Kết nối với hàng nghìn học viên cùng đam mê tiếng Hàn",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Luyện thi TOPIK",
      description: "Đề thi thử và bài luyện tập chuẩn format TOPIK",
      color: "from-orange-500 to-red-500"
    }
  ], []);

  const testimonials = useMemo(() => [
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
  ], []);

  const stats = useMemo(() => [
    { number: "10,000+", label: "Học viên", icon: <Users className="w-6 h-6" /> },
    { number: "1,000+", label: "Tài liệu", icon: <BookOpen className="w-6 h-6" /> },
    { number: "95%", label: "Tỷ lệ đậu TOPIK", icon: <Target className="w-6 h-6" /> },
    { number: "24/7", label: "Hỗ trợ", icon: <Zap className="w-6 h-6" /> }
  ], []);

  const courses = useMemo(() => [
    {
      title: "TOPIK I (Level 1-2)",
      description: "Dành cho người mới bắt đầu học tiếng Hàn",
      duration: "3 tháng",
      lessons: "120 bài học",
      price: "Free",
      image: "topik.png",
      popular: true
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
  ], []);

  // Optimized animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Trust indicators with reduced animation complexity
  const trustIndicators = useMemo(() => [
    "Miễn phí đăng ký",
    "Không cam kết dài hạn", 
    "Hỗ trợ 24/7"
  ], []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with optimized animations */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-20 px-4 overflow-hidden">
        {/* Reduced complexity background elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
        
        {/* Simplified floating elements with hardware acceleration */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 text-blue-400/30"
          style={{ willChange: 'transform' }}
        >
          <Sparkles size={40} />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 left-20 text-purple-400/30"
          style={{ willChange: 'transform' }}
        >
          <Star size={32} />
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content - Optimized animations */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 border border-gray-200/50 dark:border-gray-700/50"
              >
                <MemoizedIcon><Sparkles size={16} className="text-blue-500" /></MemoizedIcon>
                Nền tảng học tiếng Hàn #1 Việt Nam
              </motion.div>

              <motion.h1 
                className="font-inter font-bold text-5xl lg:text-7xl leading-tight text-gray-800 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Để tiếng Hàn<br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  không còn là trở ngại
                </span>
              </motion.h1>

              <motion.p 
                className="font-inter text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Dễ dàng đạt được Level mong muốn với KoraStudy.com<br />
                <span className="font-semibold text-blue-600 dark:text-blue-400">Hơn 10,000 học viên</span> đã tin tưởng và thành công
              </motion.p>
              
              {/* CTA Buttons with simplified animations */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ willChange: 'transform' }}
                >
                  <Link 
                    to="/dang-ky"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 inline-flex items-center justify-center gap-2 group"
                  >
                    Bắt đầu học ngay
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ willChange: 'transform' }}
                >
                  <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:border-blue-500 hover:text-blue-500 hover:shadow-lg inline-flex items-center justify-center gap-2">
                    <Play size={20} />
                    Xem demo
                  </button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators with simplified animations */}
              <motion.div 
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {trustIndicators.map((text, index) => (
                  <motion.div 
                    key={text}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Optimized banner slider */}
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BannerSlider 
                banners={banners} 
                currentBanner={currentBanner} 
                prevBanner={prevBanner}
                nextBanner={nextBanner}
              />
              
              {/* Simplified background decorations */}
              <motion.div 
                className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror"
                }}
              />
              <motion.div 
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                  repeatType: "mirror"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with lazy loading */}
      <AnimatedSection className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={{ willChange: 'transform' }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl mb-4 group-hover:shadow-lg transition-all duration-300">
                  <div className="text-blue-500 mb-2 flex justify-center">
                    <MemoizedIcon>{stat.icon}</MemoizedIcon>
                  </div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features Section with optimized animations */}
      <AnimatedSection className="py-20 bg-gray-50 dark:bg-gray-800" delay={0.1}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4">
              Tại sao chọn KoraStudy?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chúng tôi cung cấp phương pháp học tiếng Hàn hiệu quả nhất với công nghệ hiện đại
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                style={{ willChange: 'transform' }}
              >
                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                  style={{ willChange: 'transform' }}
                >
                  <MemoizedIcon>{feature.icon}</MemoizedIcon>
                </motion.div>
                <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Courses Section with optimized animations */}
      <AnimatedSection className="py-20 bg-white dark:bg-gray-900" delay={0.2}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4">
              Khóa học phổ biến
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Lựa chọn khóa học phù hợp với trình độ và mục tiêu của bạn
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {courses.map((course, index) => (
              <motion.div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group relative"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                style={{ willChange: 'transform' }}
              >
                {course.popular && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Phổ biến
                  </div>
                )}
                <div className="relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-500"
                    style={{ 
                      willChange: 'transform',
                      transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play size={16} />
                      {course.lessons}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{course.price}</span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ willChange: 'transform' }}
                    >
                      <Link 
                        to="/dang-ky"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        Đăng ký
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section with optimized animations */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden" delay={0.3}>
        {/* Simplified background animation */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            willChange: 'background-position',
            transform: 'translateZ(0)' // Force GPU acceleration
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-inter font-bold text-4xl text-white mb-4">
              Học viên nói gì về chúng tôi?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Hàng nghìn học viên đã thành công với KoraStudy
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={{ willChange: 'transform' }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={16} 
                      className="text-yellow-400 fill-current" 
                    />
                  ))}
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-white/70 text-sm">{testimonial.level}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section with optimized animations */}
      <AnimatedSection className="py-20 bg-gray-900 dark:bg-black relative overflow-hidden" delay={0.4}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror"
          }}
          style={{ willChange: 'opacity' }}
        />
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <motion.h2 
            className="font-inter font-bold text-4xl text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Sẵn sàng bắt đầu hành trình học tiếng Hàn?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tham gia cùng hàng nghìn học viên đã thành công với KoraStudy
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ willChange: 'transform' }}
            >
              <Link 
                to="/dang-ky"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 inline-flex items-center justify-center gap-2"
              >
                Đăng ký miễn phí
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ willChange: 'transform' }}
            >
              <Link 
                to="/lien-he"
                className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 transition-all duration-300 hover:border-white hover:bg-white/10 backdrop-blur-sm"
              >
                Liên hệ tư vấn
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;