import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import authService from "../api/authService";

const ProfileContainer = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const { user, updateProfile, updatePreferences } = useUser();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  const [preferences, setPreferences] = useState({});

  // Update editForm when user changes
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      setPreferences(user.preferences || {});
    }
  }, [user]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting profile update:", editForm);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      //  GỌI TRỰC TIẾP authService.updateProfile
      const updatedUser = await authService.updateProfile(editForm);
      console.log("Profile update result:", updatedUser);

      //  CẬP NHẬT USER CONTEXT
      if (updateProfile) {
        await updateProfile(editForm);
      }

      setIsEditing(false);
      setSuccess("Thông tin cá nhân đã được cập nhật thành công!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);

      // Xử lý lỗi chi tiết
      if (error.response && error.response.status === 500) {
        const responseData = error.response.data || {};
        const errorMessage = responseData.message || responseData.error || "";

        if (
          errorMessage.toLowerCase().includes("email") ||
          errorMessage.toLowerCase().includes("duplicate") ||
          errorMessage.toLowerCase().includes("trùng")
        ) {
          setError(
            "Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác."
          );
        } else {
          setError(
            "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau."
          );
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  //  THÊM: Hàm xử lý upload avatar
  const handleAvatarUpload = async (file) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      //  SỬA: Dùng key "file" thay vì "avatar" (theo backend expectation)
      formData.append("file", file); // <-- QUAN TRỌNG: đổi từ 'avatar' thành 'file'

      console.log("Uploading file:", file.name, file.size, file.type);

      //  GỌI TRỰC TIẾP authService.uploadAvatar
      const result = await authService.uploadAvatar(formData);

      if (result.success) {
        //  CẬP NHẬT USER CONTEXT VỚI AVATAR MỚI
        if (updateProfile) {
          await updateProfile({ avatar: result.data.avatarUrl });
        }

        setSuccess("Cập nhật ảnh đại diện thành công!");

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(result.message || "Lỗi khi cập nhật ảnh đại diện");
      }
    } catch (error) {
      console.error("Upload avatar error:", error);

      //  HIỂN THỊ LỖI CHI TIẾT
      if (error.message.includes("Required part 'file' is not present")) {
        setError("Lỗi: File không được gửi đúng định dạng. Vui lòng thử lại.");
      } else {
        setError(error.message || "Lỗi khi cập nhật ảnh đại diện");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    // ✅ CẬP NHẬT PREFERENCES
    if (updatePreferences) {
      updatePreferences(newPreferences);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName ? lastName.charAt(0) : "";
    return (first + last).toUpperCase() || "U";
  };

  const getFullName = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    if (firstName || lastName) {
      return (firstName || lastName).trim();
    }
    return user?.username || "User";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Chưa cập nhật";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGenderDisplay = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      case "OTHER":
        return "Khác";
      default:
        return "Chưa cập nhật";
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
    setEditForm,
    setError,
    setSuccess,
    handleTabChange,
    handleEditSubmit,
    handleConfirmSave,
    handleInputChange,
    handlePreferenceChange,
    handleAvatarUpload,
    getInitials,
    getFullName,
    formatDate,
    getScoreColor,
    getGenderDisplay,
    toggleTheme,
  };

  return children(profileUtils);
};

export default ProfileContainer;
