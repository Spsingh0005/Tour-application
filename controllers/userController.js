const multer = require("multer");
const sharp = require("sharp");
const factoryController = require("./factoryController");
const User = require("./../models/userModel");
const catchAsync = require("../util/catchAsync");

// const storage = multer.diskStorage({
//   dest: function (req, file, cb) {
//     cb(null, "public/img");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, file.fieldname + "-" + Date.now() + ext);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb = () => {
//       res.json("Not an image, please select only images.");
//     };
//   }
// };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/users");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({
  storage,
});

exports.uploadImage = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

exports.updateMe = async (req, res) => {
  if (req.body.password || req.body.passwordConfirms) {
    return "This route is not for password update.";
  }
  // let filterObj;
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.file) filteredBody.photo = req.file.filename;
  const updateData = await User.findByIdAndUpdate(
    res.locals.user.id,
    filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updateData,
  });
};

exports.getUser = factoryController.getOne(User);
