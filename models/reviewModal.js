const mongoose = require("mongoose");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    minLength: 3,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: true,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: Tour,
    required: true,
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email photo",
  });
  next();
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
