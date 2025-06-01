import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Logo and Description Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              {/* <h2 className="footer-logo-text">KoraStudy</h2> */}
              <div className="footer-logo-image">
                <img src="bloom.png" alt="KoraStudy Logo" />
              </div>
            </div>
            <p className="footer-description">
              Nền tảng học tiếng Hàn trực tuyến hàng đầu Việt Nam. 
              Giúp bạn chinh phục TOPIK và đạt được ước mơ du học, 
              làm việc tại Hàn Quốc.
            </p>
            <div className="footer-social">
              <h4 className="social-title">Theo dõi chúng tôi</h4>
              <div className="social-icons">
                <a href="#" className="social-icon messenger">
                  <img 
                    src="/img_social/ic_messenger.png" 
                    alt="Messenger"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('icon-fallback');
                      e.target.parentElement.innerHTML = '<span>💬</span>';
                    }}
                  />
                </a>
                <a href="#" className="social-icon gmail">
                  <img 
                    src="/img_social/ic_gmail.png" 
                    alt="Gmail"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('icon-fallback');
                      e.target.parentElement.innerHTML = '<span>📧</span>';
                    }}
                  />
                </a>
                <a href="#" className="social-icon phone">
                  <img 
                    src="/img_social/ic_phone.png" 
                    alt="Phone"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('icon-fallback');
                      e.target.parentElement.innerHTML = '<span>📞</span>';
                    }}
                  />
                </a>
                <a href="#" className="social-icon zalo">
                  <img 
                    src="/img_social/ic_zalo.png" 
                    alt="Zalo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('icon-fallback');
                      e.target.parentElement.innerHTML = '<span>💬</span>';
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3 className="footer-section-title">Liên kết nhanh</h3>
            <ul className="footer-links">
              <li><Link to="/tai-lieu">Tài liệu học tập</Link></li>
              <li><Link to="/ly-thuyet">Lý thuyết ngữ pháp</Link></li>
              <li><Link to="/lo-trinh">Lộ trình học tập</Link></li>
              <li><Link to="/luyen-tap-topik">Luyện tập TOPIK</Link></li>
              <li><Link to="/de-thi">Đề thi thử</Link></li>
              <li><Link to="/nang-cap">Nâng cấp tài khoản</Link></li>
            </ul>
          </div>

          {/* TOPIK Section */}
          <div className="footer-section">
            <h3 className="footer-section-title">TOPIK</h3>
            <ul className="footer-links">
              <li><Link to="/topik1">TOPIK I (Level 1-2)</Link></li>
              <li><Link to="/topik2">TOPIK II (Level 3-6)</Link></li>
              <li><Link to="/topik-esp">TOPIK ESP</Link></li>
              <li><Link to="/de-thi/topik1">Đề thi TOPIK I</Link></li>
              <li><Link to="/de-thi/topik2">Đề thi TOPIK II</Link></li>
              <li><Link to="/lich-thi">Lịch thi TOPIK</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h3 className="footer-section-title">Hỗ trợ</h3>
            <ul className="footer-links">
              <li><Link to="/huong-dan">Hướng dẫn sử dụng</Link></li>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/bao-cao-loi">Báo cáo lỗi</Link></li>
              <li><Link to="/gop-y">Góp ý</Link></li>
              <li><Link to="/ho-tro-ky-thuat">Hỗ trợ kỹ thuật</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="footer-section-title">Liên hệ</h3>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <span>📧</span>
                </div>
                <span>support@korastudy.com</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <span>📞</span>
                </div>
                <span>+84 123 456 789</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <span>📍</span>
                </div>
                <span>123 Đường Điện Biên Phủ, Quận Hải Châu, TP.Đà Nẵng</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <span>🕒</span>
                </div>
                <span>T2-T6: 8:00 - 17:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Đăng ký nhận thông tin mới nhất</h3>
            <p className="newsletter-description">
              Nhận thông báo về các khóa học mới, tài liệu học tập và lịch thi TOPIK
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Nhập địa chỉ email của bạn"
                className="newsletter-input"
              />
              <button className="newsletter-button">Đăng ký</button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 KoraStudy. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="footer-legal">
              <Link to="/terms" className="legal-link">Điều khoản dịch vụ</Link>
              <span className="legal-separator">|</span>
              <Link to="/privacy" className="legal-link">Chính sách bảo mật</Link>
              <span className="legal-separator">|</span>
              <Link to="/cookies" className="legal-link">Chính sách Cookie</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
