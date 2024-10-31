const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const { MONGO_URL, SESSION_SECRET } = require("./variable-config");

const indexRouter = require("./routes/index");
const eventsRouter = require("./routes/event");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/user");
const reviewRouter = require("./routes/review");
const cmuAuthRouter = require("./routes/cmu-auth");

const app = express();

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// เรียกใช้ session ก่อน passport
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false, // เปลี่ยนจาก true เป็น false เพื่อลดการเก็บ session ที่ไม่จำเป็น
    saveUninitialized: false, // เปลี่ยนจาก true เป็น false เพื่อลดการเก็บ session ที่ไม่สมบูรณ์
  })
);

// เรียกใช้ Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/event", eventsRouter);
app.use("/auth", authRouter);
app.use("/cmu-auth", cmuAuthRouter);
app.use("/user", usersRouter);

app.use("/review", reviewRouter);

module.exports = app;
