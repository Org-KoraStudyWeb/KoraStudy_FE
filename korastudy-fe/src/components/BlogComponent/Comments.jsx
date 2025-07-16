import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Calendar, Edit, Trash2, Send, X, MessageSquare } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import commentService from '../../api/commentService';
import { formatDate } from '../../utils/formatDate';
import { formatUserName } from '../../utils/formatUserName';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const Comments = ({ postId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const data = await commentService.getComments(postId);
      const commentsArray = Array.isArray(data) ? data : [];
      setComments(commentsArray);
      
      // Notify parent component about comment count change
      if (typeof onCommentCountChange === 'function') {
        onCommentCountChange(commentsArray.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để bình luận");
      navigate('/dang-nhap', { state: { returnUrl: `/blog/${postId}` } });
      return;
    }
    
    if (!newComment.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    
    try {
      setSubmitting(true);
      await commentService.addComment(postId, { context: newComment.trim() });
      setNewComment('');
      toast.success("Đã thêm bình luận");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Không thể thêm bình luận");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    
    try {
      setSubmitting(true);
      await commentService.updateComment(postId, commentId, { context: editText.trim() });
      setEditingCommentId(null);
      setEditText('');
      toast.success("Đã cập nhật bình luận");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Không thể cập nhật bình luận");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      return;
    }
    
    try {
      await commentService.deleteComment(postId, commentId);
      toast.success("Đã xóa bình luận");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Không thể xóa bình luận");
    }
  };
  
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.context);
  };
  
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
  };
  
  // Check if user can edit/delete a comment
  const canModifyComment = (comment) => {
    if (!isAuthenticated || !user) return false;
    
    // Admin can modify any comment
    if (user.roles && user.roles.includes('ROLE_ADMIN')) return true;
    
    // User can modify their own comments
    return comment.userId === user.id || comment.user?.id === user.id || user.id === comment.user_id;
  };
  
  return (
    <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bình luận
        </h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        ) : comments.length > 0 && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium flex items-center">
            <MessageSquare size={16} className="mr-1" />
            {comments.length} bình luận
          </span>
        )}
      </div>
      
      {/* Comment form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder={isAuthenticated ? "Viết bình luận của bạn..." : "Đăng nhập để bình luận"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated || submitting}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || submitting}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isAuthenticated || submitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Send size={16} className="mr-2" />
            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-4 rounded-lg">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Tác giả ẩn danh
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>
                    {formatDate(comment.publishedAt || comment.createdAt)}
                    {comment.lastModified && ' (đã chỉnh sửa)'}
                  </span>
                </div>
              </div>
              
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={submitting}
                  ></textarea>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 dark:text-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <X size={16} className="mr-1" />
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditComment(comment.id)}
                      disabled={submitting}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Send size={16} className="mr-1" />
                      {submitting ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-2 text-gray-700 dark:text-gray-300">
                    {comment.context}
                  </div>
                  
                  {canModifyComment(comment) && (
                    <div className="flex items-center gap-3 mt-3 justify-end">
                      <button
                        onClick={() => startEditing(comment)}
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Edit size={16} className="mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Xóa
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
