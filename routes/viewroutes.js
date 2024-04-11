const express = require("express");
const viewsController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const tourController = require("../controllers/tourController");

const app = express.Router();

app.use(authController.isLoggedIn);

app.route("/").get(viewsController.getOverview);

app.route("/tour/:slug").get(viewsController.gettour);

app.route("/login").get(viewsController.login);
app.route("/me").get(viewsController.userAccount);

app.route("/submit-user-data").get(viewsController.submitUserData);
app
  .route("/project-structure")
  .get(authController.protect, viewsController.projectStructure);

app
  .route("/manage-tours")
  .get(
    authController.protect,
    authController.restrictedTo("admin"),
    viewsController.manageTours
  );
module.exports = app;
