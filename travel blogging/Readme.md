# Travel Blogging System

## Student Details

- **Name:** Asad Abbas
- **Roll Number:** F22BDOCS1E02133
- **Session:** 2022-2026
- **Semester:** 5th Eve.A

## Project Overview

This is a Travel Blogging System that allows users to share their travel experiences, photos, and stories. The system has two main user roles:

1. Admin - Can manage all blog posts, users, and system settings
2. User - Can create, edit, and manage their own travel blog posts

## Features

### User Management

- User Authentication (Login/Signup)
- Role-based access control (Admin/User)
- Profile management with image upload
- User status tracking (pending/approved/rejected)

### Blog Management

- Create, read, update, and delete blog posts
- Image upload for blog posts
- Like and comment functionality
- Search and filter blogs
- Sort blogs by date and popularity

### Admin Features

- User approval system
- Dashboard with statistics
- Manage pending user requests
- Monitor user activities

### Interactive Features

- Real-time like updates
- Comment system
- User statistics tracking
- Toast notifications for actions

## Technology Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts
- Local Storage for data persistence
- ES6 Modules for code organization

## Project Structure

```
travel-blogging/
├── index.html              # Main entry point
├── css/
│   ├── auth.css           # Authentication styles
│   ├── styles.css         # Global styles
│   └── admin-dashboard.css # Admin panel styles
├── js/
│   ├── admin.js           # Admin dashboard functionality
│   ├── auth.js            # Authentication handling
│   ├── blog.js            # Blog management
│   ├── dashboard.js       # User dashboard
│   ├── profile.js         # User profile management
│   ├── downloadFonts.js   # Font resource management
│   └── services/
│       └── api.js         # API service layer
└── fonts/                 # Custom font files
```

## Core Components

### 1. Authentication System (`auth.js`)

- Login and signup functionality
- Role-based access control
- Session management

### 2. Blog Management (`blog.js`)

- Blog creation and editing
- Like and comment system
- Blog filtering and sorting

### 3. Dashboard (`dashboard.js`)

- User-specific blog feed
- Content management
- User statistics

### 4. Admin Panel (`admin.js`)

- User management
- Content moderation
- System statistics

### 5. Profile Management (`profile.js`)

- User profile editing
- Statistics tracking
- Status management

## Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone [your-repository-url]
   cd travel-blogging
   ```

2. **Install Visual Studio Code**

   - Download VS Code from: https://code.visualstudio.com/
   - Install it on your system

3. **Install Live Server Extension**

   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Click Install on the extension by Ritwick Dey

4. **Running the Project**
   - Open the project folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The project will open in your default browser at `http://127.0.0.1:5500`

## Usage

1. **First Time Setup**

   - Register as a new user
   - Choose between User or Admin role
   - Complete profile setup

2. **For Users**

   - Create and manage blog posts
   - Interact with other posts (like, comment)
   - Track personal statistics

3. **For Admins**
   - Access admin dashboard
   - Manage user approvals
   - Monitor system statistics

## Security Features

- Password protection
- Role-based access control
- Session management
- Input validation
- XSS protection

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Note

This project uses local storage for data persistence. In a production environment, it should be connected to a proper backend server and database.
