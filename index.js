const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const cookieParser = require('cookie-parser');
dotenv.config();
//this is a function declartion for connecting mongodb database
const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log('db conntected');
    })
    .catch((err) => {
      throw err;
    });
};

//middlewares
app.use(cookieParser())
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);



//Global error handler

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'something went wrong';
  return res.status(status).json({
    success: false,
    status: status,
    message,
  });
});

app.listen(8800, () => {
  //here calling the function for connecting database 
  connect()
  console.log("Backend server is running at 8800!");
});
