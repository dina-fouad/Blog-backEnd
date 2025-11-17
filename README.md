# 📝 Blog Backend API  
Backend REST API for a blogging platform built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Supports authentication, posts, comments, likes, Cloudinary image uploads —  
**🚧 Reset Password feature is still in progress.**

---

## 🚀 Features
- User Authentication (Register / Login) using JWT  
- Password hashing using bcrypt  
- CRUD operations for Blog Posts  
- Comments system  
- Like / Unlike posts  
- Image upload with Multer + Cloudinary  
- Validation using Joi  
- Security using Helmet  
- CORS enabled  
- Centralized Error Handling  

---

## ⏳ Status  
🔧 **Work in progress:**  
    **Reset Password** 

---
📁 Project Structure

├── Routes/
│   ├── Auth.js              # Authentication routes (register, login)
│   ├── Posts.js             # CRUD + likes for posts
│   ├── comments.js          # Comment creation + related operations
│   ├── users.js             # Get user data / profile
│
├── middlewares/
│   ├── errorHandling.js     # Custom error handling middleware
│   ├── photoUpload.js       # Multer config for image upload
│   ├── validateObjectId.js  # Validates MongoDB ObjectId
│   ├── verifyToken.js       # JWT authentication middleware
│
├── models/
│   ├── comment.js           # Comment schema
│   ├── post.js              # Post schema + virtual comments field
│   ├── user.js              # User schema (password hashing, validation)
│
├── utils/
│   ├── coudinary.js         # Cloudinary upload/remove utilities
│
├── node_modules/            # Auto-generated dependencies
│
├── .env                     # Environment variables
├── README.md                # Project documentation
├── server.js                # App root – connects DB, loads routes, starts server
├── package.json             # Project metadata + dependencies
├── package-lock.json        # Dependencies lock file
