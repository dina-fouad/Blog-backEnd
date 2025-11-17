# 📝 Blog Backend API  
Backend REST API for a blogging platform built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Supports authentication, password reset, posts, comments, likes, and image uploads with Cloudinary.

---

## 🚀 Features
- User Authentication (Register / Login) using JWT  
- Password Reset (send reset link via email + update password)
- Password hashing using bcrypt  
- CRUD operations for Blog Posts  
- Comments system  
- Like / Unlike posts  
- Image upload with Multer + Cloudinary  
- Validation using Joi  
- Full error handling system  
- Environment variables with dotenv  
- CORS support  

---

## 🗂️ Project Structure
├── Controllers/
├── Middlewares/
│ ├── auth.js
│ ├── errorHandling.js
├── Models/
│ ├── User.js
│ ├── Post.js
│ ├── Comment.js
├── Routes/
│ ├── Auth.js
│ ├── Users.js
│ ├── Posts.js
│ ├── Comments.js
├── uploads/
├── server.js
├── package.json
└── README.md




---

## 🛠️ Technologies Used
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Multer + Cloudinary  
- Joi Validation  
- bcryptjs  
- dotenv  
- cors  

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```sh
git clone https://github.com/dina-fouad/Blog-backEnd.git
cd Blog-backEnd

📡 API Endpoints
🔑 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/reset	Send reset password link
POST	/api/auth/reset/:id/:token	Reset user password

👤 Users
Method	Endpoint	Description
GET	/api/users	Get all users
GET	/api/users/:id	Get user by ID


📝 Posts
Method	Endpoint	Description
POST	/api/posts	Create post
GET	/api/posts	Get all posts
GET	/api/posts/:id	Get post by ID
PUT	/api/posts/:id	Update post
DELETE	/api/posts/:id	Delete post


💬 Comments
Method	Endpoint	Description
POST	/api/comments/:postId	Add comment
GET	/api/comments/:postId	Get comments on post

❤️ Likes
Method	Endpoint	Description
PUT	/api/posts/likes/:postId	Toggle like/unlike



📸 Image Upload

Uses Multer for uploading

Uses Cloudinary to store images

Returns image URL

🧰 Error Handling

Includes:

notFoundError

errorHandler (hides stack in production)

📄 License

This project is licensed under ISC License.

✨ Author

Dina Fouad

Feel free to contribute or open issues 💙