import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [showTopikDropdown, setShowTopikDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  return (
    <nav className="navbar">
      {/* <div className="nav-brand">
        <Link to="/">KoraStudy</Link>
      </div> */}
      <div className="nav-logo">
        <Link to="/">
          <img src="/bloom_black.png" alt="KoraStudy Logo" />
        </Link>
      </div>  
      <ul className="nav-menu">
        <li><Link to="/tai-lieu">Tài liệu</Link></li>
        <li><Link to="/ly-thuyet">Lý thuyết</Link></li>
        <li><Link to="/lo-trinh">Lộ trình</Link></li>
        <li 
          className="dropdown"
          onMouseEnter={() => setShowTopikDropdown(true)}
          onMouseLeave={() => setShowTopikDropdown(false)}
        >
          <Link to="/luyen-tap-topik">Luyện tập TOPIK ▼</Link>
          {showTopikDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="/topik1">Topik 1</Link></li>
              <li><Link to="/topik2">Topik 2</Link></li>
              <li><Link to="/topik-esp">Topik ESP</Link></li>
            </ul>
          )}
        </li>
        <li 
          className="dropdown"
          onMouseEnter={() => setShowExamDropdown(true)}
          onMouseLeave={() => setShowExamDropdown(false)}
        >
          <Link to="/de-thi">Đề thi ▼</Link>
          {showExamDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="/de-thi/topik1">Topik 1</Link></li>
              <li><Link to="/de-thi/topik2">Topik 2</Link></li>
              <li><Link to="/de-thi/topik-esp">Topik ESP</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/about">Về KoraStudy</Link></li>
        <li><Link to="/dang-nhap" className="login-link">Đăng nhập</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
