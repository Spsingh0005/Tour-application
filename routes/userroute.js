const express = require("express");
const app = express();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookingController");

app
  .route("/deactivate-me")
  .patch(authController.protect, authController.deactivateMe);

app.route("/signup").post(authController.signup);

app.route("/login").post(authController.login);
app.route("/logout").get(authController.logout);
app.route("/forgot-password").get(authController.forgotPassword);
app.route("/reset-password/:token").patch(authController.resetPassword);

app
  .route("/update-password")
  .patch(authController.isLoggedIn, authController.updatePassword);

app.route("/getUser/:id").get(
  // authController.protect,
  // authController.restrictedTo("admin"),
  userController.getUser
);

// app.post("/updateMe", upload.single("photo"), (req, res) => {
//   res.send(req.file);
// });

app
  .route("/updateMe")
  .post(
    authController.isLoggedIn,
    userController.uploadImage,
    userController.updateMe
  );

// app
//   .route("/updateMe")
//   .post(userController.uploadImage, userController.updateMe);

module.exports = app;
