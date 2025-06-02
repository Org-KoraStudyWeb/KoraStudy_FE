import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [showTopikDropdown, setShowTopikDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  return (
    <nav className="bg-white px-8 py-4 shadow-md flex justify-between items-center">
      <div className="nav-logo flex items-center">
        <a href="/" className="text-2xl font-bold text-gray-800 no-underline">
          <img 
          src="bloom_black.png" 
          alt="KoraStudy Logo" 
          className="h-16 w-auto mr-2"
        />
        </a>
      </div>
      
      <ul className="hidden md:flex list-none m-0 p-0 gap-8 items-center">
        <li>
          <Link 
            to="/tai-lieu" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Tài liệu
          </Link>
        </li>
        <li>
          <Link 
            to="/ly-thuyet" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Lý thuyết
          </Link>
        </li>
        <li>
          <Link 
            to="/lo-trinh" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Lộ trình
          </Link>
        </li>
        <li 
          className="relative"
          onMouseEnter={() => setShowTopikDropdown(true)}
          onMouseLeave={() => setShowTopikDropdown(false)}
        >
          <Link 
            to="/luyen-tap-topik" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Luyện tập TOPIK ▼
          </Link>
          {showTopikDropdown && (
            <ul className="absolute top-full left-0 bg-white shadow-md rounded border-0 py-2 min-w-[200px] list-none z-50">
              <li className="px-4 py-2">
                <Link 
                  to="/topik1" 
                  className="text-gray-800 no-underline block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                >
                  Topik 1
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link 
                  to="/topik2" 
                  className="text-gray-800 no-underline block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                >
                  Topik 2
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link 
                  to="/topik-esp" 
                  className="text-gray-800 no-underline block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                >
                  Topik ESP
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li 
          className="relative"
          onMouseEnter={() => setShowExamDropdown(true)}
          onMouseLeave={() => setShowExamDropdown(false)}
        >
          <Link 
            to="/de-thi" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Đề thi ▼
          </Link>
          {showExamDropdown && (
            <ul className="absolute top-full left-0 bg-white shadow-md rounded border-0 py-2 min-w-[200px] list-none z-50">
              <li className="px-4 py-2">
                <Link 
                  to="/de-thi/topik1" 
                  className="text-gray-800 no-underline block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                >
                  Topik 1
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link 
                  to="/de-thi/topik2" 
                  className="text-gray-800 no-underline block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                >
                  Topik 2
                </Link>
              </li>
              <li className="px-4 py-2">
                <Link 
                  to="/de-thi/topik-esp" 
                  className="text-gray-800 no-underline block px-4 py-2 hover:bg-gray-50 hover:text-blue-600"
                >
                  Topik ESP
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link 
            to="/blog" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Blog
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className="text-gray-800 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600"
          >
            Về KoraStudy
          </Link>
        </li>
        <li>
          <Link 
            to="/dang-nhap" 
            className="bg-primary-500 text-white rounded-full px-6 py-2 transition-colors duration-300 hover:bg-blue-600"
          >
            Đăng nhập
          </Link>
        </li>
      </ul>

      {/* Mobile menu button - you can add mobile menu functionality later */}
      <div className="md:hidden">
        <button className="text-gray-800">☰</button>
      </div>
    </nav>
  );
};

export default NavBar;
