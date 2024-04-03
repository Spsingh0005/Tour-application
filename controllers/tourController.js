const Tour = require("../models/tourModel");
const catchAsync = require("../util/catchAsync");
const factoryController = require("./factoryController");

exports.topCheaps = (req, res, next) => {
  (req.query.limit = "5"), (req.query.sort = "price -ratings");
  next();
};

exports.categorizedByDifficulty = async (req, res, next) => {
  const docs = await Tour.aggregate([
    {
      $group: {
        _id: "$difficulty",
        numTours: {
          $sum: 1,
        },
        tours: {
          $push: {
            name: "$name",
          },
        },
        averageDuration: {
          $avg: "$duration",
        },
        averagePrice: {
          $avg: "$price",
        },
      },
    },
    {
      $sort: {
        difficulty: 1,
      },
    },
  ]);

  res.status(200).json({
    data: docs,
  });
};

exports.createOne = factoryController.createOne(Tour);
exports.getAll = factoryController.getAll(Tour);
exports.updateOne = factoryController.updateOne(Tour);
exports.deleteOne = factoryController.deleteOne(Tour);

// Special functions

// exports.filterTours = async (req, res) => {
//   // const doc = await Tour.find().sort({ maxGroupSize: -1 });

//   const excludeEl = ["sort", "limit"];

//   excludeEl.forEach((el) => {
//     delete req.query[el];
//   });
//   console.log(req.query);

//   let QueryStr = JSON.stringify(req.query);
//   QueryStr = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//   console.log(QueryStr);
//   console.log(JSON.parse(QueryStr));

//   const query = await Tour.find(JSON.parse(QueryStr));

//   const doc = await query;
//   // console.log(doc);

//   res.json({
//     result: doc.length,
//     data: { doc },
//     status: "success",
//   });
// };

// exports.sortTours = async (req, res, next) => {
//   console.log(req.query.sort);

//   const sortQuery = req.query.sort.split(",").join(" ");
//   console.log(sortQuery);
//   const query = Tour.find();

//   const doc = await query.sort(sortQuery);
//   res.json({
//     status: "inside sort tours",
//     result: doc.length,
//     data: doc,
//   });
// };

// exports.limitTours = async (req, res, next) => {
//   console.log(req.query.fields);

//   let fields = req.query.fields;

//   fields = req.query.fields.split(",").join(" ");

//   const doc = await Tour.find().select(fields);

//   res.json({
//     status: "limiting fields",
//     data: doc,
//   });
// };

// exports.paginate = async (req, res) => {
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 1;

//   const skip = (page - 1) * limit;

//   const doc = await Tour.find().skip(skip);

//   res.json({
//     status: "success",
//     result: doc.length,
//     data: doc,
//   });
// };

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // Check for no images
  if (!req.files.imageCover || !req.files.images) return next();

  //Cover image
  req.body.imageCover = `tour-${req.params.id} - ${Date.now()}--cover.jpeg`;

  req.body.imageCover = await sharp(req.files.imageCover.buffer)
    .resize(2000, 1300)
    .toFormat("jpeg")
    .toFile(`public/img/tours/${req.file.filename})`);
});
