import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import blogService from '../../api/blogService';
import { useUser } from '../../contexts/UserContext';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    postTitle: '',
    postSummary: '',
    postContent: '',
    postPublished: false,
    postMetas: []
  });

  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditMode);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    // Kiểm tra xem user có đăng nhập không
    if (!isAuthenticated()) {
      toast.error('Bạn cần đăng nhập để tiếp tục');
      navigate('/dang-nhap');
      return;
    }

    if (isEditMode) {
      fetchPost();
    } else {
      setCanEdit(true); // Cho phép tạo bài viết mới
    }
  }, [id, isEditMode, isAuthenticated]);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      const post = await blogService.getPostById(id);
      
      // Kiểm tra quyền chỉnh sửa
      const isOwner = post.createdBy?.id === user?.id;
      const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;
      
      if (!isOwner && !isAdmin) {
        toast.error('Bạn không có quyền chỉnh sửa bài viết này');
        navigate('/blog');
        return;
      }

      setCanEdit(true);
      setFormData({
        postTitle: post.postTitle || '',
        postSummary: post.postSummary || '',
        postContent: post.postContent || '',
        postPublished: post.published || false,
        postMetas: []
      });

      // Fetch metas
      try {
        const postMetas = await blogService.getPostMeta(id);
        setMetas(postMetas.map(meta => ({
          id: meta.id,
          metaKey: meta.metaKey,
          postMetaContext: meta.postMetaContext
        })));
      } catch (error) {
        console.warn('Failed to fetch post metas:', error);
      }
    } catch (error) {
      toast.error('Không thể tải bài viết');
      navigate('/blog');
    } finally {
      setLoadingPost(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMetaChange = (index, field, value) => {
    const newMetas = [...metas];
    newMetas[index] = { ...newMetas[index], [field]: value };
    setMetas(newMetas);
  };

  const addMeta = () => {
    setMetas([...metas, { metaKey: '', postMetaContext: '' }]);
  };

  const removeMeta = (index) => {
    setMetas(metas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canEdit) {
      toast.error('Bạn không có quyền thực hiện thao tác này');
      return;
    }

    if (!formData.postTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    if (!formData.postContent.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }

    try {
      setLoading(true);

      const postDataToSubmit = {
        ...formData,
        postMetas: metas.filter(meta => meta.metaKey.trim() && meta.postMetaContext.trim())
          .map(meta => ({
            metaKey: meta.metaKey,
            postMetaContext: meta.postMetaContext
          }))
      };

      if (isEditMode) {
        await blogService.updatePost(id, postDataToSubmit);
        toast.success('Cập nhật bài viết thành công!');
      } else {
        await blogService.createPost(postDataToSubmit);
        toast.success('Tạo bài viết thành công!');
      }

      navigate('/blog');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(isEditMode ? 'Cập nhật bài viết thất bại' : 'Tạo bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Nếu đang load hoặc không có quyền thì hiển thị loading
  if (loadingPost || !canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? '✏️ Chỉnh sửa bài viết' : '📝 Tạo bài viết mới'}
            </h1>
            <p className="text-blue-100 mt-2">
              {isEditMode ? 'Cập nhật thông tin bài viết của bạn' : 'Chia sẻ kiến thức và kinh nghiệm học tiếng Hàn'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                id="postTitle"
                name="postTitle"
                value={formData.postTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                required
              />
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="postSummary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tóm tắt bài viết
              </label>
              <textarea
                id="postSummary"
                name="postSummary"
                value={formData.postSummary}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Viết tóm tắt ngắn gọn về nội dung bài viết..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nội dung bài viết *
              </label>
              <textarea
                id="postContent"
                name="postContent"
                value={formData.postContent}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Viết nội dung chi tiết của bài viết..."
                required
              />
            </div>

            {/* Meta Data Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Metadata (Tùy chọn)
                </label>
                <button
                  type="button"
                  onClick={addMeta}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  + Thêm Meta
                </button>
              </div>

              {metas.map((meta, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <input
                      type="text"
                      placeholder="Meta Key (ví dụ: keywords, description)"
                      value={meta.metaKey}
                      onChange={(e) => handleMetaChange(index, 'metaKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Meta Content"
                      value={meta.postMetaContext}
                      onChange={(e) => handleMetaChange(index, 'postMetaContext', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeMeta(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="postPublished"
                name="postPublished"
                checked={formData.postPublished}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="postPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Xuất bản ngay (Bỏ chọn để lưu làm bản nháp)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy bỏ
              </button>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}
                    </div>
                  ) : (
                    isEditMode ? '💾 Cập nhật bài viết' : '📝 Tạo bài viết'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;