const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3000;
require("dotenv").config();
const http = require("http");

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(console.log("Database connected successfully"));

app.listen(port, "127.0.0.1", () => {
  console.log("app connected with port " + port);
});
