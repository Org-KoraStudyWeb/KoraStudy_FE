// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
// const API_BASE_URL = 'http://localhost:3001/api';
// export const blogService = {
//   // Get all posts with pagination and filters
//   getPosts: async (page = 1, limit = 10, categoryId = null, tagId = null, search = '') => {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       ...(categoryId && { categoryId: categoryId.toString() }),
//       ...(tagId && { tagId: tagId.toString() }),
//       ...(search && { search })
//     });

//     const response = await fetch(`${API_BASE_URL}/posts?${params}`);
//     if (!response.ok) throw new Error('Failed to fetch posts');
//     return response.json();
//   },

//   // Get single post by ID
//   getPostById: async (postId) => {
//     const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
//     if (!response.ok) throw new Error('Failed to fetch post');
//     return response.json();
//   },

//   // Get all categories
//   getCategories: async () => {
//     const response = await fetch(`${API_BASE_URL}/categories`);
//     if (!response.ok) throw new Error('Failed to fetch categories');
//     return response.json();
//   },

//   // Get all tags
//   getTags: async () => {
//     const response = await fetch(`${API_BASE_URL}/tags`);
//     if (!response.ok) throw new Error('Failed to fetch tags');
//     return response.json();
//   },

//   // Get posts by category
//   getPostsByCategory: async (categoryId, page = 1, limit = 10) => {
//     const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/posts?page=${page}&limit=${limit}`);
//     if (!response.ok) throw new Error('Failed to fetch posts by category');
//     return response.json();
//   },

//   // Get posts by tag
//   getPostsByTag: async (tagId, page = 1, limit = 10) => {
//     const response = await fetch(`${API_BASE_URL}/tags/${tagId}/posts?page=${page}&limit=${limit}`);
//     if (!response.ok) throw new Error('Failed to fetch posts by tag');
//     return response.json();
//   }
// };


export const blogService = {
  getPosts: async (
    page = 1,
    limit = 9,
    categoryId = null,
    tagId = null,
    search = ''
  ) => {
    // Dữ liệu ảo
    const allPosts = [
      {
        post_id: 1,
        post_title: "Bí quyết học tiếng Hàn hiệu quả",
        post_excerpt: "Một số mẹo giúp bạn học tiếng Hàn nhanh và nhớ lâu.",
        post_content: "Nội dung chi tiết về bí quyết học tiếng Hàn...",
        category: { category_id: 1, category_name: "Kinh nghiệm học" },
        tags: [
          { tag_id: 1, tag_name: "mẹo học" },
          { tag_id: 2, tag_name: "ngữ pháp" }
        ],
        user: { user_name: "Nguyễn Văn A" },
        created_at: "2024-06-01T10:00:00Z",
        updated_at: "2024-06-01T10:00:00Z"
      },
      {
        post_id: 2,
        post_title: "Từ vựng tiếng Hàn theo chủ đề",
        post_excerpt: "Tổng hợp các từ vựng tiếng Hàn thông dụng theo chủ đề.",
        post_content: "Nội dung chi tiết về từ vựng tiếng Hàn...",
        category: { category_id: 2, category_name: "Từ vựng" },
        tags: [
          { tag_id: 3, tag_name: "từ vựng" }
        ],
        user: { user_name: "Trần Thị B" },
        created_at: "2024-06-02T11:00:00Z",
        updated_at: "2024-06-02T11:00:00Z"
      },
      {
        post_id: 3,
        post_title: "Cách luyện nghe tiếng Hàn cho người mới bắt đầu",
        post_excerpt: "Hướng dẫn luyện nghe tiếng Hàn hiệu quả.",
        post_content: "Nội dung chi tiết về luyện nghe tiếng Hàn...",
        category: { category_id: 3, category_name: "Kỹ năng nghe" },
        tags: [
          { tag_id: 4, tag_name: "luyện nghe" }
        ],
        user: { user_name: "Lê Văn C" },
        created_at: "2024-06-03T12:00:00Z",
        updated_at: "2024-06-03T12:00:00Z"
      }
    ];

    // Lọc theo category, tag, search nếu có
    let filtered = allPosts;
    if (categoryId) filtered = filtered.filter(p => p.category.category_id === categoryId);
    if (tagId) filtered = filtered.filter(p => p.tags.some(t => t.tag_id === tagId));
    if (search) filtered = filtered.filter(p => p.post_title.toLowerCase().includes(search.toLowerCase()));

    // Phân trang
    const totalPosts = filtered.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const start = (page - 1) * limit;
    const posts = filtered.slice(start, start + limit);

    return {
      posts,
      totalPages,
      totalPosts
    };
  },

  getPostById: async (id) => {
    // Dữ liệu ảo giống getPosts
    const allPosts = [
      {
        post_id: 1,
        post_title: "Bí quyết học tiếng Hàn hiệu quả",
        post_excerpt: "Một số mẹo giúp bạn học tiếng Hàn nhanh và nhớ lâu.",
        post_content: "<p>Nội dung chi tiết về bí quyết học tiếng Hàn...</p>",
        category: { category_id: 1, category_name: "Kinh nghiệm học" },
        tags: [
          { tag_id: 1, tag_name: "mẹo học" },
          { tag_id: 2, tag_name: "ngữ pháp" }
        ],
        user: { user_name: "Nguyễn Văn A" },
        created_at: "2024-06-01T10:00:00Z",
        updated_at: "2024-06-01T10:00:00Z"
      },
      {
        post_id: 2,
        post_title: "Từ vựng tiếng Hàn theo chủ đề",
        post_excerpt: "Tổng hợp các từ vựng tiếng Hàn thông dụng theo chủ đề.",
        post_content: "<p>Nội dung chi tiết về từ vựng tiếng Hàn...</p>",
        category: { category_id: 2, category_name: "Từ vựng" },
        tags: [
          { tag_id: 3, tag_name: "từ vựng" }
        ],
        user: { user_name: "Trần Thị B" },
        created_at: "2024-06-02T11:00:00Z",
        updated_at: "2024-06-02T11:00:00Z"
      },
      {
        post_id: 3,
        post_title: "Cách luyện nghe tiếng Hàn cho người mới bắt đầu",
        post_excerpt: "Hướng dẫn luyện nghe tiếng Hàn hiệu quả.",
        post_content: "<p>Nội dung chi tiết về luyện nghe tiếng Hàn...</p>",
        category: { category_id: 3, category_name: "Kỹ năng nghe" },
        tags: [
          { tag_id: 4, tag_name: "luyện nghe" }
        ],
        user: { user_name: "Lê Văn C" },
        created_at: "2024-06-03T12:00:00Z",
        updated_at: "2024-06-03T12:00:00Z"
      }
    ];
    return allPosts.find(p => p.post_id === Number(id));
  },

  getCategories: async () => [
    { category_id: 1, category_name: "Kinh nghiệm học", post_count: 1 },
    { category_id: 2, category_name: "Từ vựng", post_count: 1 },
    { category_id: 3, category_name: "Kỹ năng nghe", post_count: 1 }
  ],

  getTags: async () => [
    { tag_id: 1, tag_name: "mẹo học" },
    { tag_id: 2, tag_name: "ngữ pháp" },
    { tag_id: 3, tag_name: "từ vựng" },
    { tag_id: 4, tag_name: "luyện nghe" }
  ],

  getPostsByCategory: async (categoryId, page = 1, limit = 3) => {
    // Lấy bài viết theo category
    const posts = await blogService.getPosts(page, limit, categoryId);
    return { posts: posts.posts };
  },

  getPostsByTag: async (tagId, page = 1, limit = 3) => {
    // Lấy bài viết theo tag
    const posts = await blogService.getPosts(page, limit, null, tagId);
    return { posts: posts.posts };
  }
};