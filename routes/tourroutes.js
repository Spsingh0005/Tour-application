const express = require("express");
const app = express();
const tourController = require("../controllers/tourController");
const reviewroutes = require("./reviewroute");

app.use("/:tourId/reviews", reviewroutes);

app.route("/createOne").get(tourController.createOne);
app.route("/getAlltours").get(tourController.getAll);
app.route("/updateTour/:id").patch(tourController.updateOne);
app.route("/deleteTour/:id").delete(tourController.deleteOne);

app.route("/top-5-cheaps").get(tourController.topCheaps, tourController.getAll);
app
  .route("/categorized-by-difficulty")
  .get(tourController.categorizedByDifficulty);

module.exports = app;
