import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Clock, 
  BookOpen, 
  Award, 
  Settings, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Globe,
  Moon,
  Sun,
  Shield,
  Bell
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { user, updateProfile, updatePreferences } = useUser();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [preferences, setPreferences] = useState(user?.preferences || {});

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updatePreferences(newPreferences);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: User },
    { id: 'history', name: 'Lịch sử thi', icon: BookOpen },
    { id: 'achievements', name: 'Thành tích', icon: Trophy },
    { id: 'settings', name: 'Cài đặt', icon: Settings }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn cần đăng nhập để xem trang hồ sơ cá nhân
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {getInitials(user.fullName)}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors duration-200">
                <Camera size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="text-2xl font-bold bg-transparent border-b-2 border-primary-500 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="text-gray-600 dark:text-gray-400 bg-transparent border-b-2 border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
                    >
                      <Save size={16} />
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      <X size={16} />
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.fullName}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
                    >
                      <Edit3 size={18} />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
                </>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">{user.stats.totalTests}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bài thi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{user.stats.averageScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Điểm TB</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{user.stats.studyStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ngày liên tiếp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{user.stats.totalStudyHours}h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian học</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200 dark:border-dark-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Thông tin cá nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <User className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Họ và tên</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mục tiêu</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.preferences.testLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ngôn ngữ giao diện</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.preferences.interfaceLanguage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Hoạt động gần đây
                  </h3>
                  <div className="space-y-3">
                    {user.testHistory.slice(0, 3).map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-primary-500" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{test.testName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(test.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getScoreColor(test.score)}`}>{test.score}/100</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{test.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Lịch sử làm bài thi
                </h3>
                <div className="space-y-4">
                  {user.testHistory.map((test) => (
                    <div key={test.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {test.testName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              {formatDate(test.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              {test.totalQuestions} câu hỏi
                            </div>
                            <div className="flex items-center gap-1">
                              <Target size={16} />
                              {test.correctAnswers}/{test.totalQuestions} đúng
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                            {test.score}/100
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {test.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Huy hiệu & Thành tích
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-6 rounded-lg border-2 text-center transition-all duration-200 ${
                        badge.earned
                          ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-dark-600 dark:bg-dark-700 opacity-60'
                      }`}
                    >
                      <div className="text-4xl mb-3">{badge.icon}</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {badge.name}
                      </h4>
                      <p className={`text-sm ${
                        badge.earned 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {badge.earned ? 'Đã đạt được' : 'Chưa đạt được'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Thống kê học tập
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Trophy className="text-blue-500 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {user.stats.totalTests}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số bài thi</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Target className="text-green-500 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {user.stats.averageScore}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Award className="text-yellow-500 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {user.stats.studyStreak}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ngày học liên tiếp</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Clock className="text-purple-500 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {user.stats.totalStudyHours}h
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tổng thời gian học</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Cài đặt học tập
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mức độ TOPIK mục tiêu
                      </label>
                      <select
                        value={preferences.testLevel}
                        onChange={(e) => handlePreferenceChange('testLevel', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="TOPIK I">TOPIK I (Level 1-2)</option>
                        <option value="TOPIK II">TOPIK II (Level 3-6)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ngôn ngữ giao diện
                      </label>
                      <select
                        value={preferences.interfaceLanguage}
                        onChange={(e) => handlePreferenceChange('interfaceLanguage', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Vietnamese">Tiếng Việt</option>
                        <option value="Korean">한국어</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Giao diện & Hiển thị
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Chế độ tối</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Bảo vệ mắt khi học vào ban đêm
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Bảo mật
                  </h3>
                  <div className="space-y-4">
                    <button className="flex items-center gap-3 w-full p-4 text-left bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200">
                      <Shield size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Đổi mật khẩu</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cập nhật mật khẩu để bảo mật tài khoản
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
