import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@components/ui/Card.jsx'; // Adjust the import path as necessary

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {post.category.category_name}
            </span>
          </div>
        )}

        {/* Post Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
          <Link 
            to={`/blog/${post.post_id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {post.post_title}
          </Link>
        </h3>

        {/* Post Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {truncateContent(post.post_excerpt || post.post_content)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.tag_id}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
                >
                  #{tag.tag_name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Post Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span>작성자: {post.user?.user_name || '익명'}</span>
          </div>
          <span>{formatDate(post.created_at)}</span>
        </div>

        {/* Read More Link */}
        <div className="mt-4">
          <Link
            to={`/blog/${post.post_id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            더 읽기
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
