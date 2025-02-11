import api from "./services/api.js";

async function loadDashboardData() {
  try {
    const [users, blogs] = await Promise.all([api.getUsers(), api.getBlogs()]);

    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalBloggers").textContent = users.filter(
      (user) => user.role === "2"
    ).length;
    document.getElementById("totalBlogs").textContent = blogs.length;

    const pendingUsers = users.filter((user) => user.status === "pending");
    displayPendingUsers(pendingUsers);

    const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
    if (currentUser) {
      document.getElementById("adminName").textContent = currentUser.name;
      document.getElementById("adminProfileImg").src = currentUser.image;
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

function displayPendingUsers(pendingUsers) {
  const pendingList = document.getElementById("pendingList");
  pendingList.innerHTML =
    pendingUsers
      .map(
        (user) => `
        <div class="user-card">
            <img src="${user.image}" alt="${user.name}">
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
                <p>Plan: ${user.plan || "N/A"}</p>
                <div class="user-actions">
                    <button onclick="approveUser('${
                      user.id
                    }')" class="approve-btn">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button onclick="rejectUser('${
                      user.id
                    }')" class="reject-btn">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        </div>
    `
      )
      .join("") || "<p>No pending approvals</p>";
}

async function approveUser(userId) {
  try {
    const user = await api.getUserById(userId);
    user.status = "approved";
    await api.updateUser(userId, user);
    await loadDashboardData();
  } catch (error) {
    console.error("Error approving user:", error);
  }
}

async function rejectUser(userId) {
  try {
    const user = await api.getUserById(userId);
    user.status = "rejected";
    await api.updateUser(userId, user);
    await loadDashboardData();
  } catch (error) {
    console.error("Error rejecting user:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(sessionStorage.getItem("current_user"));
  if (!currentUser || currentUser.role !== "1") {
    window.location.href = "index.html";
    return;
  }
  loadDashboardData();
});

window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.logout = logout;

function logout() {
  sessionStorage.removeItem("current_user");
  window.location.href = "index.html";
}
