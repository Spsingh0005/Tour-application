const reviewController = require("../controllers/reviewController");
const express = require("express");
const authController = require("../controllers/authController");
const app = express.Router({ mergeParams: true });

app
  .route("/")
  .get(
    // authController.protect,
    // authController.restrictedTo("user"),
    reviewController.getReviews
  )
  .post(
    authController.protect,
    authController.restrictedTo("user"),
    reviewController.createReview
  );

app
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReviewById)
  .delete(reviewController.deleteReviewById);

module.exports = app;
