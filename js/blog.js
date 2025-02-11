import api from "./services/api.js";

async function createBlog(title, imageUrl, description) {
  const currentUser = JSON.parse(sessionStorage.getItem("current_user"));

  const newBlog = {
    userId: currentUser.id,
    title,
    imageUrl,
    description,
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
  };

  try {
    await api.createBlog(newBlog);
    return true;
  } catch (error) {
    console.error("Create blog error:", error);
    return false;
  }
}

async function toggleLike(blogId) {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    const blog = await api.getBlogById(blogId);

    const likeIndex = blog.likes.findIndex(
      (like) => like.userId === currentUser.id
    );

    if (likeIndex === -1) {
      blog.likes.push({
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
      });
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await api.updateBlog(blogId, blog);
    await loadBlogs();
  } catch (error) {
    console.error("Toggle like error:", error);
  }
}

async function addComment(blogId, text) {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    const blog = await api.getBlogById(blogId);

    blog.comments.push({
      id: Date.now().toString(),
      userId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    });

    await api.updateBlog(blogId, blog);
    return true;
  } catch (error) {
    console.error("Add comment error:", error);
    return false;
  }
}

function showCommentModal(blogId) {
  const blogs = JSON.parse(localStorage.getItem("bloges"));
  const blog = blogs.find((b) => b.id === blogId);
  const users = JSON.parse(localStorage.getItem("users"));

  const commentsList = document.getElementById("commentsList");

  document.getElementById("commentForm").dataset.blogId = blogId;

  commentsList.innerHTML =
    blog.comments
      .map((comment) => {
        const user = users.find((u) => u.id === comment.userId);
        return `
                    <div class="comment">
                        <div class="comment-header">
                            <img src="${
                              user?.image || "images/default-avatar.png"
                            }" alt="${user?.name}">
                            <strong>${user?.name}</strong>
                            <span>${new Date(
                              comment.createdAt
                            ).toLocaleString()}</span>
                        </div>
                        <p>${comment.text}</p>
                    </div>
                `;
      })
      .join("") ||
    '<p class="no-comments">No comments yet. Be the first to comment!</p>';

  document.getElementById("commentModal").style.display = "block";
}

document.getElementById("blogForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("blogTitle").value;
  const imageUrl = document.getElementById("blogImage").value;
  const description = document.getElementById("blogDescription").value;

  createBlog(title, imageUrl, description);

  document.getElementById("blogForm").reset();
  closeModal("createBlogModal");

  loadBlogs();
});

function loadBlogs() {
  const blogs = JSON.parse(localStorage.getItem("bloges")) || [];
  displayBlogs(blogs);
}

function displayBlogs(blogs) {
  const currentUser = JSON.parse(localStorage.getItem("current_user"));
  const users = JSON.parse(localStorage.getItem("users"));
  const blogList = document.getElementById("blogList");

  blogList.innerHTML = blogs
    .map((blog) => {
      const isLiked = blog.likes.some((like) => like.userId === currentUser.id);
      const author = users.find((user) => user.id === blog.userId);

      return `
                <div class="blog-card">
                    <img src="${blog.imageUrl}" alt="${blog.title}">
                    <div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>${blog.description}</p>
                        <div class="blog-meta">
                            <div class="author">
                                <img src="${author?.image}" alt="${
        author?.name
      }" class="author-img">
                                <span>${author?.name}</span>
                            </div>
                            <span class="date">${new Date(
                              blog.createdAt
                            ).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="blog-actions">
                        <button onclick="toggleLike('${
                          blog.id
                        }')" class="like-btn ${isLiked ? "liked" : ""}">
                            <i class="far fa-heart"></i> ${blog.likes.length}
                        </button>
                        <button onclick="showCommentModal('${
                          blog.id
                        }')" class="comment-btn">
                            <i class="far fa-comment"></i> ${
                              blog.comments.length
                            }
                        </button>
                    </div>
                </div>
            `;
    })
    .join("");
}

document.getElementById("commentForm").addEventListener("submit", addComment);
