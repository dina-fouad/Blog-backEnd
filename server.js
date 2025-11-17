const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
require("dotenv").config();

//init server
const app = express();
app.use(cors())


//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
const authPath = require("./Routes/Auth");
const usersPath = require("./Routes/users");
const postPath = require("./Routes/Posts");
const commentPath = require("./Routes/comments");

//Routes/middleware
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);
app.use("/api/posts", postPath);
app.use("/api/comments", commentPath);

// Error handler MUST be last
const { errorHandler, notFoundError } = require("./middlewares/errorHandling");
app.use(notFoundError);
app.use(errorHandler);

//connect to DB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

// running server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
