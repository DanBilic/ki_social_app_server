const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const customLogger = require("./middleware/customLogger");
const morgan = require("morgan");
const connectDB = require("./config/mongo_db");
//const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileupload = require("express-fileupload");

//security middleware
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const passport = require("passport");

//load environment variables
dotenv.config({ path: "./config/config.env" });

//mongoose models import
require("./models/User");
require("./models/Paw");
require("./services/passport");

//Connect to mongo DB
connectDB();

//import Route dateien
const auth = require("./routes/auth");
const paw = require("./routes/paw");

const app = express();

//Body parser
app.use(express.json());

// set some headers for security
app.use(helmet());

//rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//activate cors
app.use(cors());

//  apply to all requests
app.use(limiter);

//enable cookies for the app
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

//DEVELOPMENT logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(passport.initialize());
app.use(passport.session());

// app.use(customLogger);

//set static folder
// path.join(__dirname, "public") -> joins files and folders together
// !! static folder can be accessed in the browser with url:
//localhost:6000/uploads/photo.jpg -> uploads is the static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/paws", paw);

// Middleware for error handling last!
app.use(errorHandler);

//default PORT ist 6000
const PORT = process.env.PORT || 4000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running on `.yellow.bold,
    `PORT: ${process.env.PORT}`.magenta.bold,
    ` in mode `.yellow.bold,
    `${process.env.NODE_ENV}`.magenta.bold
  )
);

//  handle promise rejections taht are not catched
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  //  close server and terminate process
  //  process.exit(1) -> terminate process with failure
  server.close(() => process.exit(1));
});
