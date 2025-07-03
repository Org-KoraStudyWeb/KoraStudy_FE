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
  Bell,
  Phone,
  Users
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import NavBar from '../components/NavBar';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const { user, updateProfile, updatePreferences } = useUser();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Added state for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || ''
  });

  // Update editForm when user changes
  React.useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || ''
      });
    }
  }, [user]);

  const [preferences, setPreferences] = useState(user?.preferences || {});

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting profile update:', editForm);
    // Show confirmation modal instead of saving immediately
    setShowConfirmModal(true);
  };
  
  // Function to handle save after confirmation
  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await updateProfile(editForm);
      console.log('Profile update result:', result);
      
      setIsEditing(false);
      setSuccess('Thông tin cá nhân đã được cập nhật thành công!');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Handle JSON errors
      if (error.message && (
        error.message.includes('Unexpected token') || 
        error.message.includes('JSON') ||
        error.message.includes('not valid')
      )) {
        setSuccess('Thông tin đã được cập nhật. Vui lòng refresh trang để xem thay đổi.');
      } else {
        setError(error.message || 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updatePreferences(newPreferences);
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  };

  const getFullName = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    if (firstName || lastName) {
      return (firstName || lastName).trim();
    }
    return user?.username || 'User';
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

  const getGenderDisplay = (gender) => {
    switch(gender) {
      case 'MALE': return 'Nam';
      case 'FEMALE': return 'Nữ';
      case 'OTHER': return 'Khác';
      default: return 'Chưa cập nhật';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: User },
    { id: 'history', name: 'Lịch sử thi', icon: BookOpen },
    { id: 'achievements', name: 'Thành tích', icon: Trophy },
    { id: 'settings', name: 'Cài đặt', icon: Settings }
  ];

  if (!user) {
    return (
      <>
        <NavBar />
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
      </>
    );
  }

  // Confirmation modal component
  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Xác nhận lưu thông tin
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Bạn có chắc chắn muốn cập nhật thông tin cá nhân?
          </p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-500 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmSave}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavBar />
      
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
                    alt={getFullName(user.firstName, user.lastName)}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(user.firstName, user.lastName)}
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
                    {/* Error message */}
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <X size={16} />
                          {error}
                        </div>
                      </div>
                    )}

                    {/* Success message */}
                    {success && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Save size={16} />
                          {success}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Họ
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Nhập họ"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tên
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Nhập tên"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nhập email"
                        disabled={loading}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={editForm.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Nhập số điện thoại"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Giới tính
                        </label>
                        <select
                          name="gender"
                          value={editForm.gender}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          disabled={loading}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editForm.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                          loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-primary-500 hover:bg-primary-600'
                        } text-white`}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Lưu
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setError('');
                          setSuccess('');
                        }}
                        disabled={loading}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
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
                        {getFullName(user.firstName, user.lastName)}
                      </h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email || 'Chưa có email'}</p>
                  </>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">{user.stats?.totalTests || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bài thi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{user.stats?.averageScore || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Điểm TB</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{user.stats?.studyStreak || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ngày liên tiếp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{user.stats?.totalStudyHours || 0}h</div>
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Thông tin cá nhân
                  </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <User className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Họ</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.firstName || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Tên</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.lastName || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.email || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại</p>
                          <p className="font-medium text-gray-900 dark:text-white">{user.phoneNumber || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Giới tính</p>
                          <p className="font-medium text-gray-900 dark:text-white">{getGenderDisplay(user.gender)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-gray-400" size={20} />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ngày sinh</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>
                    </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Hoạt động gần đây
                    </h3>
                    <div className="space-y-3">
                      {user.testHistory && user.testHistory.length > 0 ? (
                        user.testHistory.slice(0, 3).map((test) => (
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
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Chưa có hoạt động nào</p>
                          <p className="text-sm">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
                        </div>
                      )}
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
                    {user.testHistory && user.testHistory.length > 0 ? (
                      user.testHistory.map((test) => (
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
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <BookOpen size={64} className="mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-medium mb-2">Chưa có lịch sử thi</h4>
                        <p>Hãy bắt đầu làm bài thi đầu tiên để xem lịch sử ở đây!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Huy hiệu & Thành tích
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.badges && user.badges.length > 0 ? (
                      user.badges.map((badge) => (
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
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                        <Trophy size={64} className="mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-medium mb-2">Chưa có huy hiệu</h4>
                        <p>Hãy tham gia các bài thi để nhận huy hiệu!</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Thống kê học tập
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Trophy className="text-blue-500 mx-auto mb-2" size={24} />
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {user.stats?.totalTests || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số bài thi</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Target className="text-green-500 mx-auto mb-2" size={24} />
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {user.stats?.averageScore || 0}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Award className="text-yellow-500 mx-auto mb-2" size={24} />
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {user.stats?.studyStreak || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Ngày học liên tiếp</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Clock className="text-purple-500 mx-auto mb-2" size={24} />
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {user.stats?.totalStudyHours || 0}h
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
                          value={preferences.testLevel || 'TOPIK I'}
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
                          value={preferences.interfaceLanguage || 'Vietnamese'}
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

      {/* Add confirmation modal here */}
      <ConfirmationModal />
    </>
  );
};

export default Profile;