import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../api/authService';

const ProfileContainer = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { user, updateProfile, updatePreferences } = useUser();
  const { theme, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || ''
  });
  
  const [preferences, setPreferences] = useState(user?.preferences || {});

  // Update editForm when user changes
  useEffect(() => {
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

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting profile update:', editForm);
    setShowConfirmModal(true);
  };
  
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

  // Call refreshUserProfile when component mounts
  useEffect(() => {
    if (user?.id) {
      authService.refreshUserProfile();
    }
  }, [user?.id]);

  const profileUtils = {
    user,
    activeTab,
    isEditing,
    editForm,
    loading,
    error,
    success,
    preferences,
    theme,
    showConfirmModal,
    setShowConfirmModal,
    setIsEditing,
    handleTabChange,
    handleEditSubmit,
    handleConfirmSave,
    handleInputChange,
    handlePreferenceChange,
    getInitials,
    getFullName,
    formatDate,
    getScoreColor,
    getGenderDisplay,
    toggleTheme
  };

  return children(profileUtils);
};

export default ProfileContainer;