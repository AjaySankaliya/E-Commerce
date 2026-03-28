# Nexel E-Commerce Platform

Nexel is a full-featured, modern E-Commerce web application built with a premium design and robust functional implementation. It offers a seamless shopping experience for users and a comprehensive dashboard for administrators.

## 🚀 Features

### 👤 User Authentication & Security
- **Advanced Auth Flow**: Secure Login and Signup with professional UI.
- **OTP Verification**: Email-based OTP for account security.
- **Password Recovery**: Integrated Forgot Password, OTP request, and Change Password workflow.
- **Protected Routes**: Secure access for both common users and administrators.

### 🛒 Shopping Experience
- **Product Gallery**: Browsing products with categorized views.
- **Cart Management**: Add, remove, and update quantities from a stylish cart UI.
- **Wishlist**: Save favorite items for later.
- **Checkout Process**: Multi-step checkout including Shipping, Payment, and Order Review.
- **Responsive Layout**: Designed to look stunning on all screen sizes.

### ⚙️ Admin Dashboard
- **Admin Layout**: A dedicated dashboard for management.
- **User Management**: View and manage customer accounts.
- **Order Management**: Track and update order statuses (Pending, Shipped, Delivered).
- **Statistics**: Overview of business performance.

## 🛠️ Tech Stack

### Frontend
- **React.js** (v19) - Component-based architecture.
- **Vite** - Lightning-fast build tool.
- **Tailwind CSS** - Modern, utility-first styling.
- **Shadcn UI** - Premium component library.
- **Redux Toolkit** - Global state management with persistence.
- **Lucide React** - Clean and consistent iconography.
- **Axios** - Handling API communication.
- **Sonner** - Polished toast notifications.

### Backend
- **Node.js & Express** - Scalable backend infrastructure.
- **MongoDB** - NoSQL database with Mongoose ODM.
- **JWT (JSON Web Tokens)** - Secure authentication.
- **Bcrypt** - Industry-standard password hashing.
- **Cloudinary** - Efficient image storage for products.
- **Nodemailer** - Handling OTP and verification emails.
- **Joi** - Robust data validation.

## 📦 Getting Started

### Prerequisites
- Node.js installed.
- MongoDB instance (Atlas or local).
- Cloudinary account (for image handling).

### 1. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file and add your credentials:
# PORT=3001
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# CLOUDINARY_NAME=...
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password
# VITE_API_URL=http://localhost:3001

# Start server
npm run dev
```

### 2. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file:
# VITE_API_URL=http://localhost:3001

# Start development server
npm run dev
```

## 📂 Project Structure

```text
E-Commerce/
├── backend/            # Express Application
│   ├── controllers/    # Request handlers
│   ├── models/         # Database schemas
│   ├── routers/        # API endpoints
│   ├── middleware/     # Auth & Validation
│   └── server.js       # Main entry point
└── frontend/           # Vite + React Application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # View components
    │   ├── redux/      # Global state slices
    │   └── App.jsx     # Main routing
    └── index.html      # Main HTML entry
```

## 🎨 Professional Design
The project focuses on high-quality aesthetics including:
- **Light Theme Excellence**: Clean, soft color palettes (`slate-50`, `blue-600`).
- **Interactive Micro-animations**: Enhancing user engagement.
- **Glassmorphism**: Backdrop blur effects for modern card designs.

## ⚖️ License
Distributed under the ISC License.

---
Built with ❤️ by Nexel Team.
