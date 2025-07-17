import { API_BASE_URL } from '../config';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Handle errors properly
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  try {
    return await response.json();
  } catch (err) {
    return {}; // Return empty object if JSON is invalid
  }
};

export const commentService = {
  // Get all comments for a post
  getComments: async (postId) => {
    try {
      console.log(`Fetching comments for post ${postId}`);
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      console.log('API response status:', response.status);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add a new comment (requires authentication)
  addComment: async (postId, commentData) => {
    try {
      console.log(`Adding comment to post ${postId}`, commentData);
      
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(commentData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.status}`);
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update an existing comment (only for comment author or admin)
  updateComment: async (postId, commentId, commentData) => {
    try {
      console.log(`Updating comment ${commentId} for post ${postId}`, commentData);
      
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(commentData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update comment: ${response.status}`);
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment (only for comment author or admin)
  deleteComment: async (postId, commentId) => {
    try {
      console.log(`Deleting comment ${commentId} from post ${postId}`);
      
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.status}`);
      }
      
      return true; // Return success
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
  
  // Get comment count for a single post
  getCommentCount: async (postId) => {
    try {
      const comments = await commentService.getComments(postId);
      return Array.isArray(comments) ? comments.length : 0;
    } catch (error) {
      console.error(`Error getting comment count for post ${postId}:`, error);
      return 0; // Return 0 if error
    }
  },
  
  // Get comment counts for multiple posts
  getCommentCounts: async (postIds) => {
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return {};
    }
    
    try {
      console.log('Fetching comment counts for posts:', postIds);
      
      // Không sử dụng batch API nữa vì nó đang gây lỗi 404
      // Sử dụng trực tiếp cách lấy comments cho từng bài viết
      const results = {};
      await Promise.all(
        postIds.map(async (postId) => {
          // Gọi trực tiếp API lấy danh sách comments cho bài viết
          try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
              method: 'GET',
              headers: getAuthHeaders(),
            });
            
            if (response.ok) {
              const comments = await response.json();
              results[postId] = Array.isArray(comments) ? comments.length : 0;
            } else {
              results[postId] = 0;
            }
          } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            results[postId] = 0;
          }
        })
      );
      
      console.log('Comment counts fetched:', results);
      return results;
    } catch (error) {
      console.error('Error getting comment counts:', error);
      return {}; // Return empty object if error
    }
  }
};

export default commentService;
