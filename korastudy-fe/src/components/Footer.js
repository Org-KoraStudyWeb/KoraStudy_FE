import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white mt-auto font-inter">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 py-[60px]">
          {/* Logo and Description Section */}
          <div className="lg:col-span-2 max-w-[300px]">
            <div className="flex items-center gap-3 mb-5">
              
              <div className="w-[150px] h-[90px] flex-shrink-0">
                <img 
                  src="bloom.png" 
                  alt="KoraStudy Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  // onError={(e) => {
                  //   e.target.style.display = 'none';
                  //   e.target.parentElement.innerHTML = '<div class="w-full h-full bg-white/20 rounded-lg flex items-center justify-center text-2xl">🌸</div>';
                  // }}
                />
              </div>
            </div>
            <p className="text-sm leading-[1.6] text-white/80 mb-[30px]">
              Nền tảng học tiếng Hàn trực tuyến hàng đầu Việt Nam. 
              Giúp bạn chinh phục TOPIK và đạt được ước mơ du học, 
              làm việc tại Hàn Quốc.
            </p>
            <div className="mt-5">
              <h4 className="text-base font-semibold mb-[15px] text-white">Theo dõi chúng tôi</h4>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_messenger.png" 
                    alt="Messenger"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>💬</span>';
                    }}
                  />
                </a>
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_gmail.png" 
                    alt="Gmail"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>📧</span>';
                    }}
                  />
                </a>
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_phone.png" 
                    alt="Phone"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>📞</span>';
                    }}
                  />
                </a>
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_zalo.png" 
                    alt="Zalo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>💬</span>';
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Liên kết nhanh</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-3">
                <Link to="/tai-lieu" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Tài liệu học tập
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/ly-thuyet" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Lý thuyết ngữ pháp
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/lo-trinh" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Lộ trình học tập
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/luyen-tap-topik" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Luyện tập TOPIK
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/de-thi" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Đề thi thử
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/blog" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Hỗ trợ</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-3">
                <Link to="/huong-dan" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/faq" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/lien-he" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Liên hệ
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/bao-cao-loi" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Báo cáo lỗi
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/gop-y" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Góp ý
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/ho-tro-ky-thuat" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Hỗ trợ kỹ thuật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Liên hệ</h3>
            <div className="flex flex-col gap-[15px]">
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">📧</span>
                </div>
                <span>support@korastudy.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">📞</span>
                </div>
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">📍</span>
                </div>
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">🕒</span>
                </div>
                <span>T2-T6: 8:00 - 17:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white/10 rounded-xl p-[30px] mb-10">
          <div className="text-center max-w-[600px] mx-auto">
            <h3 className="text-2xl font-semibold mb-2.5 text-white">Đăng ký nhận thông tin mới nhất</h3>
            <p className="text-sm text-white/80 mb-[25px] leading-[1.5]">
              Nhận thông báo về các khóa học mới, tài liệu học tập và lịch thi TOPIK
            </p>
            <div className="flex gap-3 max-w-[400px] mx-auto">
              <input 
                type="email" 
                placeholder="Nhập địa chỉ email của bạn"
                className="flex-1 px-4 py-3 border-0 rounded-lg text-sm outline-none bg-white text-gray-800 placeholder-gray-500"
              />
              <button className="px-6 py-3 bg-primary-500 text-white border-0 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-300 whitespace-nowrap hover:bg-blue-600">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 py-[25px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-[15px]">
            <div>
              <p className="m-0 text-sm text-white/70">&copy; 2024 KoraStudy. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex items-center gap-[15px] flex-wrap justify-center">
              <Link to="/terms" className="text-white/70 text-sm transition-colors duration-300 hover:text-white">
                Điều khoản dịch vụ
              </Link>
              <span className="text-white/50 text-sm">|</span>
              <Link to="/privacy" className="text-white/70 text-sm transition-colors duration-300 hover:text-white">
                Chính sách bảo mật
              </Link>
              <span className="text-white/50 text-sm">|</span>
              <Link to="/cookies" className="text-white/70 text-sm transition-colors duration-300 hover:text-white">
                Chính sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
