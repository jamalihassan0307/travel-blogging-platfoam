import api from "./services/api.js";

async function loadDashboard() {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    if (!currentUser) {
      window.location.href = "index.html";
      return;
    }

    document.getElementById("userProfileImg").src = currentUser.image;
    document.getElementById("userName").textContent = currentUser.name;

    updateUserActions(currentUser);

    await loadBlogs();
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

async function loadBlogs() {
  try {
    await loadAndFilterBlogs();
  } catch (error) {
    console.error("Error loading blogs:", error);
  }
}

async function displayBlogs(blogs) {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    const users = await api.getUsers();
    const blogList = document.getElementById("blogList");

    if (!blogs || blogs.length === 0) {
      blogList.innerHTML = '<p class="no-blogs">No blogs found</p>';
      return;
    }

    blogList.innerHTML = blogs
      .map((blog) => {
        const isLiked = blog.likes?.some(
          (like) => like.userId === currentUser.id
        );
        const author = users.find((user) => user.id === blog.userId);

        return `
                <div class="blog-card">
                    <img src="${blog.imageUrl}" alt="${
          blog.title
        }" onerror="this.src='images/default-blog.jpg'">
                    <div class="blog-content">
                        <h3>${blog.title}</h3>
                        <p>${blog.description}</p>
                        <div class="blog-meta">
                            <div class="author">
                                <img src="${
                                  author?.image || "images/default-avatar.png"
                                }" alt="${
          author?.name || "Unknown"
        }" class="author-img">
                                <span>${author?.name || "Unknown Author"}</span>
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
                            <i class="fas fa-heart" style="color: ${
                              isLiked ? "#fff" : "#f00"
                            }"></i>
                            <span>${blog.likes?.length || 0}</span>
                        </button>
                        <button onclick="showCommentModal('${
                          blog.id
                        }')" class="comment-btn">
                            <i class="far fa-comment"></i>
                            <span>${blog.comments?.length || 0}</span>
                        </button>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Error displaying blogs:", error);
    document.getElementById("blogList").innerHTML =
      '<p class="error">Error loading blogs. Please try again later.</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadDashboard);

document.getElementById("blogForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("blogTitle").value;
  const imageUrl = document.getElementById("blogImage").value;
  const description = document.getElementById("blogDescription").value;

  try {
    await createBlog(title, imageUrl, description);
    document.getElementById("blogForm").reset();
    closeModal("createBlogModal");
    await loadBlogs();
  } catch (error) {
    console.error("Error creating blog:", error);
    alert("Failed to create blog. Please try again.");
  }
});

window.showCreateBlogModal = showCreateBlogModal;
window.showPaymentModal = showPaymentModal;
window.closeModal = closeModal;
window.selectPlan = selectPlan;
window.toggleLike = toggleLike;
window.showCommentModal = showCommentModal;
window.logout = logout;

function showCreateBlogModal() {
  document.getElementById("createBlogModal").style.display = "block";
}

function showPaymentModal() {
  document.getElementById("paymentModal").style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function updateUserActions(user) {
  const bloggerActions = document.getElementById("bloggerActions");
  const userActions = document.getElementById("userActions");

  if (user.status === "approved" && user.role === "2") {
    bloggerActions.classList.remove("hidden");
    userActions.classList.add("hidden");
  } else if (user.status === "pending") {
    bloggerActions.classList.add("hidden");
    userActions.innerHTML = '<p class="pending-status">Approval Pending...</p>';
  } else if (user.status === "rejected") {
    bloggerActions.classList.add("hidden");
    userActions.innerHTML =
      '<p class="rejected-status">Blogger application rejected</p>';
  } else {
    bloggerActions.classList.add("hidden");
    userActions.classList.remove("hidden");
  }
}

function selectPlan(plan) {
  const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
  currentUser.plan = plan;
  currentUser.status = "pending";
  currentUser.paymentDate = new Date().toISOString();

  api
    .updateUser(currentUser.id, currentUser)
    .then(() => {
      sessionStorage.setItem("current_user", JSON.stringify(currentUser));
      closeModal("paymentModal");
      updateUserActions(currentUser);
      alert(
        `${
          plan.charAt(0).toUpperCase() + plan.slice(1)
        } plan selected. Waiting for admin approval.`
      );
    })
    .catch((error) => {
      console.error("Error updating user plan:", error);
      alert("Failed to select plan. Please try again.");
    });
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
    console.error("Error toggling like:", error);
  }
}

function showCommentModal(blogId) {
  const commentModal = document.getElementById("commentModal");
  commentModal.style.display = "block";

  document.getElementById("commentForm").dataset.blogId = blogId;

  api.getBlogById(blogId).then((blog) => {
    const commentsList = document.getElementById("commentsList");
    if (blog.comments && blog.comments.length > 0) {
      api.getUsers().then((users) => {
        commentsList.innerHTML = blog.comments
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
          .join("");
      });
    } else {
      commentsList.innerHTML =
        '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    }
  });
}

function logout() {
  sessionStorage.removeItem("current_user");
  window.location.href = "index.html";
}

async function createBlog(title, imageUrl, description) {
  try {
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

    const createdBlog = await api.createBlog(newBlog);
    if (createdBlog) {
      showToast("Blog created successfully!", "success");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Create blog error:", error);
    showToast("Failed to create blog. Please try again.", "error");
    return false;
  }
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
        }"></i>
        ${message}
    `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

async function addComment(blogId, text) {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    const blog = await api.getBlogById(blogId);

    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    blog.comments.push(newComment);
    await api.updateBlog(blogId, blog);
    showToast("Comment added successfully!", "success");
    return true;
  } catch (error) {
    console.error("Add comment error:", error);
    showToast("Failed to add comment. Please try again.", "error");
    return false;
  }
}

document.getElementById("commentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const blogId = e.target.dataset.blogId;
  const text = document.getElementById("commentText").value;

  if (await addComment(blogId, text)) {
    document.getElementById("commentText").value = "";
    closeModal("commentModal");
    await loadBlogs();
  }
});

async function loadAndFilterBlogs() {
  try {
    const blogs = await api.getBlogs();
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let filteredBlogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.description.toLowerCase().includes(searchTerm)
    );

    switch (sortType) {
      case "latest":
        filteredBlogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        filteredBlogs.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "mostLiked":
        filteredBlogs.sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
        break;
    }

    await displayBlogs(filteredBlogs);
  } catch (error) {
    console.error("Error filtering blogs:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();

  document.getElementById("searchInput").addEventListener("input", () => {
    loadAndFilterBlogs();
  });

  document.getElementById("sortSelect").addEventListener("change", () => {
    loadAndFilterBlogs();
  });
});
