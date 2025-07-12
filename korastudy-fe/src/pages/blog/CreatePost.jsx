import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import { useUser } from '../../contexts/UserContext';
import blogService from '../../api/blogService';

const CreatePost = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUser();
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Kiểm tra xác thực
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để tạo bài viết');
      navigate('/login', { state: { from: '/blog/create' } });
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const postData = {
        postTitle: title,
        postSummary: summary,
        postContent: content,
        published: published
      };
      
      console.log('Submitting new post data:', postData);
      
      await blogService.createPost(postData);
      toast.success('Bài viết đã được tạo thành công!');
      navigate('/blog?created=true');
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Không thể tạo bài viết: ' + (err.message || 'Đã xảy ra lỗi'));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Lấy API key từ biến môi trường
  const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY;
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Tạo bài viết mới
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
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | removeformat | image | help',
                  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; }',
                  image_advtab: true,
                  file_picker_types: 'image',
                  automatic_uploads: true,
                  images_upload_handler: async (blobInfo, progress) => {
                    // Nếu bạn muốn thêm tính năng upload ảnh, thêm code xử lý tại đây
                    // Ví dụ đơn giản: chuyển ảnh thành base64
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        resolve(reader.result);
                      };
                      reader.readAsDataURL(blobInfo.blob());
                    });
                  }
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
                {submitting ? 'Đang tạo...' : 'Tạo bài viết'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;