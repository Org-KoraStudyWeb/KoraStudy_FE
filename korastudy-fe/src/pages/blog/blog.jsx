import React, { useState, useEffect } from 'react';
import BlogCard from '../../components/BlogCard.jsx';
import BlogCategories from '../../components/BlogCategories.jsx';
import BlogTags from '../../components/BlogTags.jsx';
import BlogSearch from '../../components/BlogSearch.jsx';
import { blogService } from '../../api/blogService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 9;

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch posts when filters change
  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory, selectedTag, searchTerm]);

  const fetchInitialData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        blogService.getCategories(),
        blogService.getTags()
      ]);
      
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu ban đầu.');
      console.error('Error fetching initial data:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPosts(
        currentPage,
        postsPerPage,
        selectedCategory,
        selectedTag,
        searchTerm
      );
      
      setPosts(response.posts || []);
      setTotalPages(response.totalPages || 1);
      setTotalPosts(response.totalPosts || 0);
    } catch (err) {
      setError('Lỗi khi tải bài viết.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null); // Reset tag filter
    setCurrentPage(1);
  };

  const handleTagSelect = (tagId) => {
    setSelectedTag(tagId);
    setSelectedCategory(null); // Reset category filter
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setSelectedCategory(null);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 mx-1 text-gray-500 bg-white rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Trước
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 mx-1 text-gray-500 bg-white rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Sau
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8">
        {pages}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Đã xảy ra lỗi</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog học tiếng Hàn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Chia sẻ kinh nghiệm học tiếng Hàn, văn hóa và các mẹo hữu ích.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <BlogSearch onSearch={handleSearch} />
            <BlogCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <BlogTags
              tags={tags}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Tổng {totalPosts} bài viết
                {searchTerm && ` (Tìm kiếm: "${searchTerm}")`}
                {selectedCategory && categories.find(cat => cat.category_id === selectedCategory) && 
                  ` (Chuyên mục: ${categories.find(cat => cat.category_id === selectedCategory).category_name})`}
                {selectedTag && tags.find(tag => tag.tag_id === selectedTag) && 
                  ` (Tag: #${tags.find(tag => tag.tag_id === selectedTag).tag_name})`}
              </p>
            </div>

            {/* Posts Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.post_id} post={post} />
                  ))}
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  Không có bài viết phù hợp
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedTag(null);
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;