const catchAsync = require("../util/catchAsync");
const ApiFeatures = require("../util/ApiFeatures");

exports.createOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.create(req.body);

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(model.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    // Aggregation pipeline

    const doc = await features.modalFunction;
    if (!doc) return next(new AppError("error while getting users", 400));

    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });

    if (!doc) {
      res.status(400).json({
        message: "updation error",
        data: Error,
      });
    }

    await doc.save();

    res.status(200).json({
      status: "updated",
    });
  });

exports.deleteOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    await Modal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "deleted",
    });
  });

exports.getOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findById(req.params.id);

    res.status(200).json({
      status: "User found",
      data: doc,
    });
  });
