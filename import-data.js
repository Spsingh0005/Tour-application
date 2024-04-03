const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("./models/tourModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModal");

mongoose
  .connect(
    "mongodb+srv://robinsingh199815:GRyzHrl2ycprT847@node-revision.fcjcdtf.mongodb.net/"
  )
  .then(console.log("Database connected successfully"));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, "utf-8", () => {
    console.log("reading tours....");
  })
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, "utf-8", () => {
    console.log("reading users...");
  })
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, "utf-8", () => {
    console.log("reading reviews");
  })
);
const create = async () => {
  console.log("inside create function");

  await Tour.create(tours);
  await User.create(users);
  await Review.create(reviews);

  console.log("Data loaded");
};

const deletetours = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted");
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import" && "import") {
  console.log("inside import process");
  create();
} else if (process.argv[2] === "--delete" && "delete") {
  console.log("inside delete process");
  deletetours();
}

console.log(process.argv);
