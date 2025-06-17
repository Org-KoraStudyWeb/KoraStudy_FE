import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NavBar = () => {
  const [showTopikDropdown, setShowTopikDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white dark:bg-dark-800 px-4 md:px-8 py-4 shadow-xl border-b border-gray-200 dark:border-dark-700 flex justify-between items-center transition-colors duration-300 relative z-50">
        <div className="nav-logo flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="bloom_black.png" 
              alt="KoraStudy Logo" 
              className="h-12 md:h-16 w-auto mr-2 dark:filter dark:brightness-0 dark:invert"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex list-none m-0 p-0 gap-8 items-center">
          <li>
            <Link 
              to="/courses" 
              className="text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Khóa học
            </Link>
          </li>

          <li>
            <Link 
              to="/tai-lieu" 
              className="text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Tài liệu
            </Link>
          </li>

          <li>
            <Link 
              to="/lo-trinh" 
              className="text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
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
              className="text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Luyện tập TOPIK ▼
            </Link>
            {showTopikDropdown && (
              <ul className="absolute top-full left-0 bg-white dark:bg-dark-800 shadow-md dark:shadow-card-dark rounded border-0 py-2 min-w-[200px] list-none z-50 border border-gray-200 dark:border-dark-700">
                <li className="px-4 py-2">
                  <Link 
                    to="/topik1" 
                    className="text-gray-800 dark:text-gray-200 no-underline block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
                  >
                    Topik 1
                  </Link>
                </li>
                <li className="px-4 py-2">
                  <Link 
                    to="/topik2" 
                    className="text-gray-800 dark:text-gray-200 no-underline block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
                  >
                    Topik 2
                  </Link>
                </li>
                <li className="px-4 py-2">
                  <Link 
                    to="/topik-esp" 
                    className="text-gray-800 dark:text-gray-200 no-underline block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
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
              className="text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Đề thi ▼
            </Link>
            {showExamDropdown && (
              <ul className="absolute top-full left-0 bg-white dark:bg-dark-800 shadow-md dark:shadow-card-dark rounded border-0 py-2 min-w-[200px] list-none z-50 border border-gray-200 dark:border-dark-700">
                <li className="px-4 py-2">
                  <Link 
                    to="/de-thi/topik1" 
                    className="text-gray-800 dark:text-gray-200 no-underline block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
                  >
                    Topik 1
                  </Link>
                </li>
                <li className="px-4 py-2">
                  <Link 
                    to="/de-thi/topik2" 
                    className="text-gray-800 dark:text-gray-200 no-underline block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
                  >
                    Topik 2
                  </Link>
                </li>
                <li className="px-4 py-2">
                  <Link 
                    to="/de-thi/topik-esp" 
                    className="text-gray-800 dark:text-gray-200 no-underline block px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors duration-200"
                  >
                    Topik ESP
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link 
              to="/about" 
              className="text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-2 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Về KoraStudy
            </Link>
          </li>

          {/* Theme Toggle */}
          <li>
            <ThemeToggle />
          </li>

          <li>
            <Link 
              to="/dang-nhap" 
              className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6 py-2 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Đăng nhập
            </Link>
          </li>
        </ul>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-800 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          ></div>
          
          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-dark-800 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <img 
                  src="bloom_black.png" 
                  alt="KoraStudy Logo" 
                  className="h-10 w-auto dark:filter dark:brightness-0 dark:invert"
                />
                <button 
                  onClick={closeMobileMenu}
                  className="text-gray-800 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-4">
                  <Link 
                    to="/courses" 
                    onClick={closeMobileMenu}
                    className="block text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Khóa học
                  </Link>

                  <Link 
                    to="/tai-lieu" 
                    onClick={closeMobileMenu}
                    className="block text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Tài liệu
                  </Link>

                  <Link 
                    to="/lo-trinh" 
                    onClick={closeMobileMenu}
                    className="block text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Lộ trình
                  </Link>

                  {/* TOPIK Dropdown */}
                  <div className="space-y-1">
                    <Link 
                      to="/luyen-tap-topik" 
                      onClick={closeMobileMenu}
                      className="block text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Luyện tập TOPIK
                    </Link>
                    <div className="ml-4 space-y-1">
                      <Link 
                        to="/topik1" 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 dark:text-gray-400 no-underline text-sm px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Topik 1
                      </Link>
                      <Link 
                        to="/topik2" 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 dark:text-gray-400 no-underline text-sm px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Topik 2
                      </Link>
                      <Link 
                        to="/topik-esp" 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 dark:text-gray-400 no-underline text-sm px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Topik ESP
                      </Link>
                    </div>
                  </div>

                  {/* Exam Dropdown */}
                  <div className="space-y-1">
                    <Link 
                      to="/de-thi" 
                      onClick={closeMobileMenu}
                      className="block text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Đề thi
                    </Link>
                    <div className="ml-4 space-y-1">
                      <Link 
                        to="/de-thi/topik1" 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 dark:text-gray-400 no-underline text-sm px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Topik 1
                      </Link>
                      <Link 
                        to="/de-thi/topik2" 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 dark:text-gray-400 no-underline text-sm px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Topik 2
                      </Link>
                      <Link 
                        to="/de-thi/topik-esp" 
                        onClick={closeMobileMenu}
                        className="block text-gray-600 dark:text-gray-400 no-underline text-sm px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Topik ESP
                      </Link>
                    </div>
                  </div>

                  <Link 
                    to="/about" 
                    onClick={closeMobileMenu}
                    className="block text-gray-800 dark:text-gray-200 no-underline text-base px-4 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Về KoraStudy
                  </Link>
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-dark-700 p-4">
                <Link 
                  to="/dang-nhap" 
                  onClick={closeMobileMenu}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center rounded-full px-6 py-3 transition-colors duration-300 shadow-md hover:shadow-lg font-medium"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
