import api from "./services/api.js";

async function loadUserProfile() {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    if (!currentUser) {
      window.location.href = "index.html";
      return;
    }

    document.getElementById("profileImage").src =
      currentUser.image || "images/default-avatar.png";
    document.getElementById("profileName").textContent = currentUser.name;
    document.getElementById("profileEmail").textContent = currentUser.email;
    document.getElementById(
      "profileStatus"
    ).textContent = `Status: ${currentUser.status}`;

    document.getElementById("editName").value = currentUser.name;
    document.getElementById("editEmail").value = currentUser.email;
    document.getElementById("editImage").value = currentUser.image || "";

    document.getElementById("editEmail").readOnly = true;

    await loadUserStats(currentUser.id);
    updateStatusBadge(currentUser.status);
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

async function loadUserStats(userId) {
  try {
    const blogs = await api.getBlogs();

    const userBlogs = blogs.filter((blog) => blog.userId === userId);
    const userLikes = blogs.reduce(
      (total, blog) =>
        total + blog.likes.filter((like) => like.userId === userId).length,
      0
    );
    const userComments = blogs.reduce(
      (total, blog) =>
        total +
        blog.comments.filter((comment) => comment.userId === userId).length,
      0
    );

    document.getElementById("totalBlogs").textContent = userBlogs.length;
    document.getElementById("totalLikes").textContent = userLikes;
    document.getElementById("totalComments").textContent = userComments;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    const name = document.getElementById("editName").value;
    const password = document.getElementById("editPassword").value;
    const imageUrl = document.getElementById("editImage").value;

    const updatedUser = {
      ...currentUser,
      name,
      password: password || currentUser.password,
      image: imageUrl || currentUser.image,
    };

    await api.updateUser(currentUser.id, updatedUser);
    sessionStorage.setItem("current_user", JSON.stringify(updatedUser));

    showSuccessMessage("Profile updated successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error("Error updating profile:", error);
    showErrorMessage("Failed to update profile. Please try again.");
  }
});

function showSuccessMessage(message) {
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
  document.querySelector(".edit-profile-section").prepend(successMessage);
}

function showErrorMessage(message) {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
  document.querySelector(".edit-profile-section").prepend(errorMessage);
}

function updateStatusBadge(status) {
  const badge = document.getElementById("statusBadge");
  badge.className = "status-badge";

  switch (status) {
    case "approved":
      badge.classList.add("approved");
      break;
    case "pending":
      badge.classList.add("pending");
      break;
    case "rejected":
      badge.classList.add("rejected");
      break;
  }
}

function logout() {
  sessionStorage.removeItem("current_user");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", loadUserProfile);

window.logout = logout;
