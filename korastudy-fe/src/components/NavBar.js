import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Menu, Sun, Moon, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from 'contexts/ThemeContext';
import { useUser } from 'contexts/UserContext';

const NavBar = () => {
  const [showTopikDropdown, setShowTopikDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-dark-800 px-4 md:px-8 py-1 shadow-xl border-b border-gray-200 dark:border-dark-700 flex justify-between items-center transition-colors duration-300">
        <div className="nav-logo flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="bloom_black.png"
              alt="KoraStudy Logo"
              className="h-12 md:h-16 w-auto mr-2 dark:filter dark:brightness-0 dark:invert"
            />
          </Link>
        </div>

        <ul className="hidden md:flex list-none m-0 p-0 gap-8 items-center">
          <li><Link to="/courses" className="text-gray-800 dark:text-gray-200 text-base px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400">Khóa học</Link></li>
          <li><Link to="/tai-lieu" className="text-gray-800 dark:text-gray-200 text-base px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400">Tài liệu</Link></li>
          <li><Link to="/lo-trinh" className="text-gray-800 dark:text-gray-200 text-base px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400">Lộ trình</Link></li>

          <li className="relative" onMouseEnter={() => setShowTopikDropdown(true)} onMouseLeave={() => setShowTopikDropdown(false)}>
            <Link to="/luyen-tap-topik" className="text-gray-800 dark:text-gray-200 px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400">Luyện tập TOPIK ▼</Link>
            {showTopikDropdown && (
              <ul className="absolute top-full left-0 bg-white dark:bg-dark-800 shadow-md rounded py-2 min-w-[200px] border border-gray-200 dark:border-dark-700">
                <li><Link to="/topik1" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700">Topik 1</Link></li>
                <li><Link to="/topik2" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700">Topik 2</Link></li>
                <li><Link to="/topik-esp" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700">Topik ESP</Link></li>
              </ul>
            )}
          </li>

          <li className="relative" onMouseEnter={() => setShowExamDropdown(true)} onMouseLeave={() => setShowExamDropdown(false)}>
            <Link to="/de-thi" className="text-gray-800 dark:text-gray-200 px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400">Đề thi ▼</Link>
            {showExamDropdown && (
              <ul className="absolute top-full left-0 bg-white dark:bg-dark-800 shadow-md rounded py-2 min-w-[200px] border border-gray-200 dark:border-dark-700">
                <li><Link to="/de-thi/topik1" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700">Topik 1</Link></li>
                <li><Link to="/de-thi/topik2" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700">Topik 2</Link></li>
                <li><Link to="/de-thi/topik-esp" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700">Topik ESP</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/about" className="text-gray-800 dark:text-gray-200 px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400">Về KoraStudy</Link></li>

          <li>
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </li>

          <li>
            {isAuthenticated && user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{getInitials(user.fullName)}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.fullName}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-dark-700 z-50">
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"><User size={16} className="mr-2" /> Hồ sơ cá nhân</Link>
                    <Link to="/profile?tab=settings" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"><Settings size={16} className="mr-2" /> Cài đặt</Link>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"><LogOut size={16} className="mr-2" /> Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/dang-nhap" className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg">Đăng nhập</Link>
            )}
          </li>
        </ul>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={toggleMobileMenu} className="text-gray-800 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-dark-800 shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <img src="bloom_black.png" alt="KoraStudy Logo" className="h-10 w-auto dark:filter dark:brightness-0 dark:invert" />
                <button onClick={closeMobileMenu} className="text-gray-800 dark:text-gray-200 p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-4">
                  <Link to="/courses" onClick={closeMobileMenu} className="block px-4 py-3">Khóa học</Link>
                  <Link to="/tai-lieu" onClick={closeMobileMenu} className="block px-4 py-3">Tài liệu</Link>
                  <Link to="/lo-trinh" onClick={closeMobileMenu} className="block px-4 py-3">Lộ trình</Link>
                  <Link to="/luyen-tap-topik" onClick={closeMobileMenu} className="block px-4 py-3">Luyện tập TOPIK</Link>
                  <div className="ml-4">
                    <Link to="/topik1" onClick={closeMobileMenu} className="block px-4 py-2">Topik 1</Link>
                    <Link to="/topik2" onClick={closeMobileMenu} className="block px-4 py-2">Topik 2</Link>
                    <Link to="/topik-esp" onClick={closeMobileMenu} className="block px-4 py-2">Topik ESP</Link>
                  </div>
                  <Link to="/de-thi" onClick={closeMobileMenu} className="block px-4 py-3">Đề thi</Link>
                  <div className="ml-4">
                    <Link to="/de-thi/topik1" onClick={closeMobileMenu} className="block px-4 py-2">Topik 1</Link>
                    <Link to="/de-thi/topik2" onClick={closeMobileMenu} className="block px-4 py-2">Topik 2</Link>
                    <Link to="/de-thi/topik-esp" onClick={closeMobileMenu} className="block px-4 py-2">Topik ESP</Link>
                  </div>
                  <Link to="/about" onClick={closeMobileMenu} className="block px-4 py-3">Về KoraStudy</Link>
                </nav>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-700 p-4">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="block w-full text-red-600">Đăng xuất</button>
                ) : (
                  <Link to="/dang-nhap" onClick={closeMobileMenu} className="block w-full bg-primary-500 text-white text-center px-6 py-3 rounded-full">Đăng nhập</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
