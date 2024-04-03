const expresss = require("express");
const testroutes = require("./routes/testroute");
const tourroutes = require("./routes/tourroutes");
const userroutes = require("./routes/userroute");
const reviewroutes = require("./routes/reviewroute");
const viewroutes = require("./routes/viewroutes");
const bookingroutes = require("./routes/bookingroute");
const path = require("path");
const app = expresss();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");

// app.set(
//   expresss.static(`${__dirname}`, {
//     setHeaders: function (res) {
//       res.set({
//         "Content-Security-Policy": "script-src-elem 'self'",
//       });
//     },
//   })
// );

app.use(hpp());
app.use(compression());

// mongo sanitization for $ removal
app.use(mongoSanitize());

// data sanitization
app.use(xss());

// Using limiter to restrict limit
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: "Too many requests,please try again.",
});

app.use(helmet());

app.use(expresss.urlencoded({ extended: false }));

app.use(expresss.json());
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

app.use(expresss.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdn.jsdelivr.net;"
  );

  next();
});

app.use("/", viewroutes);
app.use("/api", testroutes);
app.use("/api/tours", tourroutes);
app.use("/api/users", userroutes);
app.use("/api/reviews", reviewroutes);
app.use("/api/bookings", bookingroutes);

module.exports = app;
