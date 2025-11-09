const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//init server
const app = express();

//Routes
const authPath = require('./Routes/Auth')
const usersPath = require('./Routes/users')






//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//Routes/middleware
app.use('/api/auth', authPath)
app.use('/api/users', usersPath)




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
