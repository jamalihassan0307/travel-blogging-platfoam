import api from './services/api.js';

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
    document.querySelector('.tab-btn:nth-child(2)').classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.querySelector('.tab-btn:nth-child(1)').classList.remove('active');
    document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
}

document.getElementById('loginTab').addEventListener('click', showLogin);
document.getElementById('signupTab').addEventListener('click', showSignup);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    try {
        const users = await api.getUsers();
        const user = users.find(
            (u) => u.email === email && u.password === password && u.role === role
        );

        if (user) {
            sessionStorage.setItem("current_user", JSON.stringify(user));
            window.location.href = user.role === '1' ? 'admin-dashboard.html' : 'dashboard.html';
        } else {
            alert('Invalid credentials!');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const image = document.getElementById('signupImage').value;
    const role = document.getElementById('signupRole').value;

    try {
        const users = await api.getUsers();
        if (users.some(user => user.email === email)) {
            alert('Email already registered!');
            return;
        }

        const newUser = {
            name,
            email,
            password,
            image,
            role,
            status: role === '1' ? 'approved' : 'normal'
        };

        await api.createUser(newUser);
        alert('Registration successful! Please login.');
        showLogin();
        document.getElementById('signupForm').reset();
    } catch (error) {
        console.error('Signup error:', error);
        alert('Registration failed. Please try again.');
    }
});
