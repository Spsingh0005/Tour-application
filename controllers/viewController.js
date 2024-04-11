const Tour = require("../models/tourModel");
const User = require("../models/userModel");

const Review = require("../models/reviewModal");

exports.getOverview = async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overviews", {
    title: "Home",
    tours,
  });
};

exports.manageTours = async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("manageTours", {
    title: "Manage Tours",
    tours,
  });
};

exports.gettour = async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "guides",
    field: "name rating review",
  });
  const reviews = await Review.find({ tour: tour._id });

  res.status(200).render("tour", {
    title: "Tour",
    tour,
    reviews,
  });
};

exports.login = async (req, res) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.userAccount = async (req, res, next) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(400).json({
      status: "fail",
      message: "Please login again...",
    });
  }
  res.status(200).render("userAccount", {
    title: "Your Account",
    user,
  });
};

exports.submitUserData = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: res.locals.user.id },
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: "true",
    }
  );

  res.status(200).render("userAccount", {
    title: "My account",
    user: updatedUser,
  });
};

exports.projectStructure = async (req, res) => {
  try {
    res.status(200).render("projectStructure", {
      title: "Project Structure",
    });
  } catch (error) {
    res.json(error);
  }
};
