const factoryController = require("./factoryController");
const Review = require("./../models/reviewModal");
const catchAsync = require("../util/catchAsync");

exports.getReviewById = factoryController.getOne(Review);
exports.updateReviewById = factoryController.updateOne(Review);
exports.deleteReviewById = factoryController.deleteOne(Review);

exports.getReviews = async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
};

exports.createReview = catchAsync(async (req, res, next) => {
  // if the Id mentioned for tour inside body, then take id from params

  // if (!req.body.tour) req.body.tourId = req.params.tour;
  // if (!req.body.user) req.body.userId = req.user.id;

  let data = {
    review: req.body.review,
    rating: req.body.rating,
    user: req.body.userId,
    tour: req.body.tourId,
  };

  const newReview = await Review.create(data);

  res.status(200).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
