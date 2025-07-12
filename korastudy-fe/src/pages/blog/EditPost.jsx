// src/pages/blog/EditPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import { useUser } from '../../contexts/UserContext';
import blogService from '../../api/blogService';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Kiểm tra xác thực
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để chỉnh sửa bài viết');
      navigate('/login', { state: { from: `/blog/edit/${id}` } });
    }
  }, [isAuthenticated, navigate, id]);
  
  // Lấy dữ liệu bài viết
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogService.getPostById(id);
        console.log('Post data retrieved for editing:', data);
        
        // Kiểm tra quyền chỉnh sửa
        const creatorId = data.createdBy?.id || data.author?.id || null;
        const isAuthor = creatorId === user?.id;
        const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('admin');
        
        if (!isAuthor && !isAdmin) {
          toast.error('Bạn không có quyền chỉnh sửa bài viết này');
          navigate(`/blog/${id}`);
          return;
        }
        
        setPost(data);
        setTitle(data.postTitle || data.post_title || '');
        setSummary(data.postSummary || data.post_excerpt || '');
        setContent(data.postContent || data.post_content || '');
        setPublished(data.published || data.post_published || true);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id && isAuthenticated) {
      fetchPost();
    }
  }, [id, isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Xác định đúng cấu trúc dữ liệu để gửi lên API
      // Sử dụng cùng cấu trúc với dữ liệu đã nhận
      const postData = {
        id: post.id || post.post_id,
        postTitle: title,
        postContent: content,
        postSummary: summary,
        published: published
      };
      
      // Thêm trường createdBy nếu có trong dữ liệu gốc để đảm bảo giữ nguyên thông tin tác giả
      if (post.createdBy) {
        postData.createdBy = post.createdBy;
      }
      
      console.log('Submitting updated post data:', postData);
      
      await blogService.updatePost(id, postData);
      toast.success('Bài viết đã được cập nhật thành công!');
      navigate(`/blog/${id}?updated=true`);
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error('Không thể cập nhật bài viết: ' + (err.message || 'Đã xảy ra lỗi'));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Lấy API key từ biến môi trường
  const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;
  
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-10"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-10 bg-blue-200 dark:bg-blue-900 rounded w-32"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Không thể tải bài viết</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách bài viết
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Chỉnh sửa bài viết
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="summary" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Tóm tắt
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Nhập tóm tắt ngắn gọn về bài viết"
                rows="3"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <Editor
                apiKey={TINYMCE_API_KEY} // Sử dụng biến môi trường
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | image | help',
                  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; }'
                }}
              />
            </div>
            
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200">Xuất bản ngay</span>
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  submitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Đang lưu...' : 'Cập nhật bài viết'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/blog/${id}`)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditPost;