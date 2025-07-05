import React, { useEffect, useState, useRef } from 'react';
import { Award, BookOpen, Users, Target, Star, TrendingUp, Globe, BookMarked, ShieldCheck } from 'lucide-react';
// import NavBar from '@components/NavBar.jsx';
// import Footer from '@components/Footer.jsx';

const About = () => {
  const [animatedItems, setAnimatedItems] = useState({});
  const observerRefs = useRef([]);
  
  // Thiết lập Intersection Observer để phát hiện khi phần tử xuất hiện trong viewport
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            setAnimatedItems(prev => ({
              ...prev,
              [id]: true
            }));
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Thêm tất cả các phần tử cần quan sát vào observer
    document.querySelectorAll('[data-id]').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const teamMembers = [
  
  {
    name: "Vũ Minh Quang",
    title: "Full-stack Developer",
    experience: "4+ năm kinh nghiệm",
    image: "/public/teamdev/quang.jpg",
    bio: "Tốt nghiệp Đại học CNTT Việt Hàn với chuyên ngành Lập trình Back-end, đã tham gia phát triển dự án KoraStudy từ những ngày đầu."
  },
  {
    name: "Từ Đàm Văn Thiên",
    experience: "5+ năm kinh nghiệm",
    image: "public/teamdev/thien.jpg",
    bio: "Người sáng lập và điều hành KoraStudy, tốt nghiệp loại giỏi chuyên ngành Full-stack Development tại Đại học CNTT Việt Hàn. Với niềm đam mê về công nghệ và ngôn ngữ Hàn Quốc, anh đã khởi xướng dự án KoraStudy với sứ mệnh giúp người Việt dễ dàng tiếp cận và chinh phục tiếng Hàn.",
    isLeader: true
  },
  {
    name: "Nguyễn Văn Trung",
    title: "Full-stack Developer",
    experience: "4+ năm kinh nghiệm",
    image: "/public/teamdev/trung.jpg",
    bio: "Tốt nghiệp Đại học CNTT Việt Hàn, chuyên về phát triển giao diện người dùng và trải nghiệm người dùng."
  }
];

  const coreValues = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Hiệu quả",
      description: "Phương pháp giảng dạy tối ưu, giúp học viên tiến bộ nhanh chóng trong thời gian ngắn nhất."
    },
    {
      icon: <ShieldCheck className="w-12 h-12" />,
      title: "Chất lượng",
      description: "Cam kết mang đến nội dung học tập chất lượng cao, được biên soạn kỹ lưỡng bởi các chuyên gia."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Cộng đồng",
      description: "Xây dựng môi trường học tập sôi động, nơi học viên có thể kết nối và hỗ trợ lẫn nhau."
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Tiếp cận",
      description: "Giúp mọi người tiếp cận với việc học tiếng Hàn một cách dễ dàng và thuận tiện nhất."
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
     
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-60 -left-40 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div 
            className="text-center mb-8 transition-all duration-700"
            data-id="hero-title"
          >
            <h1 className={`font-inter font-bold text-5xl mb-6 transition-all duration-700 ${animatedItems['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Về KoraStudy
            </h1>
            <p className={`text-xl text-white/80 max-w-2xl mx-auto transition-all duration-700 delay-300 ${animatedItems['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Nền tảng học tiếng Hàn trực tuyến hàng đầu Việt Nam, giúp bạn chinh phục ngôn ngữ Hàn Quốc một cách hiệu quả và thú vị.
            </p>
          </div>
          
          <div className={`flex justify-center transition-all duration-700 delay-500 ${animatedItems['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-20 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className="text-center mb-16"
            data-id="mission-vision-title"
          >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['mission-vision-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Sứ mệnh & Tầm nhìn
            </h2>
            <div className={`w-20 h-1 bg-primary-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['mission-vision-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div 
              className="bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg transition-all duration-700"
              data-id="mission-card"
            >
              <div className={`w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-500 mb-6 transition-all duration-700 ${animatedItems['mission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Target size={32} />
              </div>
              <h3 className={`font-semibold text-2xl text-gray-800 dark:text-white mb-4 transition-all duration-700 delay-100 ${animatedItems['mission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Sứ mệnh
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 delay-200 ${animatedItems['mission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                KoraStudy ra đời với sứ mệnh giúp người Việt Nam tiếp cận và chinh phục ngôn ngữ Hàn Quốc một cách hiệu quả. Chúng tôi cam kết mang đến các khóa học chất lượng cao, công nghệ học tập tiên tiến và cộng đồng hỗ trợ tận tâm, giúp học viên đạt được mục tiêu học tập của mình.
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg transition-all duration-700"
              data-id="vision-card"
            >
              <div className={`w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-500 mb-6 transition-all duration-700 ${animatedItems['vision-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <BookMarked size={32} />
              </div>
              <h3 className={`font-semibold text-2xl text-gray-800 dark:text-white mb-4 transition-all duration-700 delay-100 ${animatedItems['vision-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Tầm nhìn
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 delay-200 ${animatedItems['vision-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                KoraStudy hướng tới trở thành nền tảng học tiếng Hàn trực tuyến hàng đầu Đông Nam Á, kết nối cầu nối văn hóa và ngôn ngữ giữa Việt Nam và Hàn Quốc. Chúng tôi không ngừng đổi mới phương pháp giảng dạy, cá nhân hóa trải nghiệm học tập và mở rộng cơ hội cho mọi người tiếp cận với tiếng Hàn.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-20 bg-gray-100 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className="text-center mb-16"
            data-id="core-values-title"
          >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['core-values-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Giá trị cốt lõi
            </h2>
            <div className={`w-20 h-1 bg-primary-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['core-values-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['core-values-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Những giá trị định hướng mọi hoạt động của KoraStudy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-lg text-center transition-all duration-700"
                data-id={`core-value-${index}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-primary-500 mx-auto mb-6 transition-all duration-700 transform ${animatedItems[`core-value-${index}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-45'}`}>
                  {value.icon}
                </div>
                <h3 className={`font-semibold text-xl text-gray-800 dark:text-white mb-4 transition-all duration-700 delay-200 ${animatedItems[`core-value-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {value.title}
                </h3>
                <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 delay-300 ${animatedItems[`core-value-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Future Direction Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className="text-center mb-16"
            data-id="future-title"
          >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['future-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Định hướng tương lai
            </h2>
            <div className={`w-20 h-1 bg-primary-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['future-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['future-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Những bước tiến tiếp theo của KoraStudy
            </p>
          </div>
          
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 md:p-12 text-white shadow-xl"
            data-id="future-card"
          >
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className={`font-semibold text-2xl mb-6 transition-all duration-700 ${animatedItems['future-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Lộ trình phát triển
                </h3>
                <ul className="space-y-4">
                  <li className={`flex items-start gap-3 transition-all duration-700 delay-100 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-6 h-6 bg-white text-primary-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <p className="text-white/90">
                      Mở rộng nội dung khóa học với các chuyên ngành tiếng Hàn đặc thù: Y tế, Du lịch, CNTT.
                    </p>
                  </li>
                  <li className={`flex items-start gap-3 transition-all duration-700 delay-200 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-6 h-6 bg-white text-primary-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <p className="text-white/90">
                      Phát triển công nghệ AI hỗ trợ học viên trong việc phát âm và trợ giảng thông minh.
                    </p>
                  </li>
                  <li className={`flex items-start gap-3 transition-all duration-700 delay-300 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-6 h-6 bg-white text-primary-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <p className="text-white/90">
                      Thiết lập quan hệ hợp tác với các trường đại học và doanh nghiệp Hàn Quốc.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className={`font-semibold text-2xl mb-6 transition-all duration-700 delay-400 ${animatedItems['future-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Cam kết của chúng tôi
                </h3>
                <p className={`text-white/90 mb-6 leading-relaxed transition-all duration-700 delay-500 ${animatedItems['future-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  KoraStudy cam kết không ngừng đổi mới và cải tiến để mang đến trải nghiệm học tập tiếng Hàn tốt nhất cho người học. Chúng tôi hướng tới việc:
                </p>
                <ul className="space-y-3">
                  <li className={`flex items-center gap-3 transition-all duration-700 delay-600 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span>Cá nhân hóa lộ trình học tập cho mỗi học viên</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-all duration-700 delay-700 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span>Tích hợp công nghệ mới vào quá trình dạy và học</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-all duration-700 delay-800 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span>Mở rộng cộng đồng học tập toàn cầu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
    <section className="py-20 bg-gray-100 dark:bg-dark-800">
    <div className="max-w-7xl mx-auto px-4">
        <div 
        className="text-center mb-16"
        data-id="team-title"
        >
        <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['team-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Đội ngũ phát triển
        </h2>
        <div className={`w-20 h-1 bg-primary-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['team-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
        <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['team-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Đội ngũ phát triển KoraStudy gồm các thành viên đam mê công nghệ và ngôn ngữ Hàn Quốc
        </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
            <div 
            key={index}
            className={`bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-lg transition-all duration-700 ${member.isLeader ? 'md:col-span-3 lg:col-span-1 ring-4 ring-primary-500 transform hover:-translate-y-2' : 'transform hover:-translate-y-1'}`}
            data-id={`team-member-${index}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            >
            <div className={`h-64 bg-gradient-to-r ${member.isLeader ? 'from-yellow-400 via-primary-500 to-secondary-500' : 'from-primary-500 to-secondary-500'} flex items-center justify-center transition-all duration-700 ${animatedItems[`team-member-${index}`] ? 'opacity-100' : 'opacity-0'} relative`}>
                {member.isLeader && (
                <div className="absolute top-4 right-4 bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Founder
                </div>
                )}
                <div className="relative w-48 h-60 rounded-xl overflow-hidden border-4 border-yellow-100 shadow-lg mx-auto">
                    <img 
                    src={member.image} 
                    alt={member.name}
                    className={`w-full h-full object-cover object-top transition-all duration-700 transform ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}`}
                    />
                </div>
            </div>
            <div className={`p-6 ${member.isLeader ? 'bg-gradient-to-br from-white to-blue-50 dark:from-dark-700 dark:to-primary-900/10' : ''}`}>
                <h3 className={`font-semibold ${member.isLeader ? 'text-2xl' : 'text-xl'} text-gray-800 dark:text-white mb-1 transition-all duration-700 delay-200 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.name}
                </h3>
                <p className={`${member.isLeader ? 'text-primary-600 font-semibold' : 'text-primary-500'} mb-2 transition-all duration-700 delay-300 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.title}
                </p>
                <p className={`text-sm text-gray-500 dark:text-gray-400 mb-4 transition-all duration-700 delay-400 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.experience}
                </p>
                <p className={`text-gray-600 dark:text-gray-300 transition-all duration-700 delay-500 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.bio}
                </p>
                {member.isLeader && (
                <div className={`mt-4 flex justify-end transition-all duration-700 delay-600 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 mr-4">
                    LinkedIn
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">
                    GitHub
                    </a>
                </div>
                )}
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>
    

        {/* Road Map Section */}
        <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div 
            className="text-center mb-16"
            data-id="roadmap-title"
            >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['roadmap-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Lộ trình học tiếng Hàn
            </h2>
            <div className={`w-20 h-1 bg-primary-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['roadmap-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['roadmap-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Con đường chinh phục trình độ tiếng Hàn từ người mới bắt đầu đến chuyên gia
            </p>
            </div>
            
            {/* Timeline */}
            <div className="relative">
            {/* Middle line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500 via-secondary-500 to-blue-500"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
                {/* Level 1 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level1"
                >
                <div className={`md:w-1/2 md:pr-16 transition-all duration-700 ${animatedItems['roadmap-level1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 1 - Nhập môn
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Làm quen với tiếng Hàn</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Giai đoạn đầu tiên tập trung vào bảng chữ cái Hangul, phát âm cơ bản, và từ vựng thông dụng hàng ngày. 
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 1-2 tháng</div>
                    </div>
                    </div>
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level1'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    1
                    </div>
                </div>
                
                <div className="md:w-1/2 md:pl-16 md:mt-0 mt-6">
                    {/* Empty for alignment */}
                </div>
                </div>
                
                {/* Level 2 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level2"
                >
                <div className="md:w-1/2 md:pr-16">
                    {/* Empty for alignment */}
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level2'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    2
                    </div>
                </div>
                
                <div className={`md:w-1/2 md:pl-16 md:mt-0 mt-6 transition-all duration-700 ${animatedItems['roadmap-level2'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 2 - Nền tảng
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Cấu trúc ngữ pháp cơ bản</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Học các cấu trúc câu cơ bản, thì cơ bản và từ vựng đủ để giao tiếp hàng ngày đơn giản.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 2-3 tháng</div>
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Level 3 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level3"
                >
                <div className={`md:w-1/2 md:pr-16 transition-all duration-700 ${animatedItems['roadmap-level3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 3 - Trung cấp
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Nâng cao kỹ năng giao tiếp</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Mở rộng vốn từ vựng, học cấu trúc câu phức tạp hơn, và bắt đầu thực hành giao tiếp thực tế.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 3-4 tháng</div>
                    </div>
                    </div>
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level3'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    3
                    </div>
                </div>
                
                <div className="md:w-1/2 md:pl-16 md:mt-0 mt-6">
                    {/* Empty for alignment */}
                </div>
                </div>
                
                {/* Level 4 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level4"
                >
                <div className="md:w-1/2 md:pr-16">
                    {/* Empty for alignment */}
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level4'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    4
                    </div>
                </div>
                
                <div className={`md:w-1/2 md:pl-16 md:mt-0 mt-6 transition-all duration-700 ${animatedItems['roadmap-level4'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 4 - Nâng cao
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Chuẩn bị TOPIK</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Luyện thi TOPIK (Test of Proficiency in Korean), tập trung vào cả 4 kỹ năng nghe, nói, đọc, viết.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 4-6 tháng</div>
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Level 5 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level5"
                >
                <div className={`md:w-1/2 md:pr-16 transition-all duration-700 ${animatedItems['roadmap-level5'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 5 - Chuyên gia
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tiếng Hàn chuyên ngành</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Tiếng Hàn chuyên ngành theo lĩnh vực bạn quan tâm như kinh doanh, y tế, du lịch, CNTT...
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: Liên tục</div>
                    </div>
                    </div>
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-green-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level5'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    5
                    </div>
                </div>
                
                <div className="md:w-1/2 md:pl-16 md:mt-0 mt-6">
                    {/* Empty for alignment */}
                </div>
                </div>
            </div>
            </div>
            
            {/* Button to Learning Path */}
            <div className={`flex justify-center mt-12 transition-all duration-700 ${animatedItems['roadmap-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
            <a 
                href="/lo-trinh"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
                Xem lộ trình chi tiết
            </a>
            </div>
        </div>
        </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div 
          className="max-w-4xl mx-auto text-center px-4"
          data-id="cta-section"
        >
          <h2 className={`font-inter font-bold text-4xl mb-6 transition-all duration-700 ${animatedItems['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Trở thành một phần của cộng đồng KoraStudy
          </h2>
          <p className={`text-xl text-white/80 mb-8 transition-all duration-700 delay-300 ${animatedItems['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Bắt đầu hành trình học tiếng Hàn của bạn ngay hôm nay
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${animatedItems['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a 
              href="/dang-ky"
              className="bg-white text-primary-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              Đăng ký miễn phí
            </a>
            <a 
              href="/lien-he"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>
      
      
      {/* Thêm hiệu ứng counter số */}
      <style jsx>{`
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .count-up {
          animation: count-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default About;