import React, { useState, useEffect } from 'react';
import { CheckCheck, X } from 'lucide-react';
import notificationService from '../api/notificationService';

const NotificationDropdown = ({ isOpen, onClose, onMarkAsRead, onMarkAllAsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      onMarkAsRead?.();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      onMarkAllAsRead?.();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-dark-700 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-dark-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Thông báo</h3>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="p-1 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            title="Đánh dấu tất cả là đã đọc"
          >
            <CheckCheck size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400">
            Không có thông báo nào
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                notification.read ? 'opacity-70' : 'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {notification.title}
                </h4>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-1 text-xs text-primary-500 hover:text-primary-600"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {notification.content}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formatDate(notification.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;