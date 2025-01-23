const API_BASE_URL = "https://678876232c874e66b7d53be2.mockapi.io/data";

const api = {
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    return await response.json();
  },

  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return await response.json();
  },

  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  async getBlogs() {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    console.log("Fetching blogs from:", `${API_BASE_URL}/blogs`);
    const data = await response.json();
    console.log("Blogs data:", data);
    return data;
  },

  async getBlogById(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    return await response.json();
  },

  async createBlog(blogData) {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });
    console.log("dadadad", blogData);
    return await response.json();
  },

  async updateBlog(id, blogData) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });
    return await response.json();
  },

  async deleteBlog(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  },
};

export default api;
