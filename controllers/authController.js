const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("./../util/catchAsync");
const Email = require("../util/nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const secret_key = "tom_hanks";

const { promisify } = require("util");

const expiresIn = "90d";

const generateToken = (id) => {
  // const jwtToken = jwt.sign({ id }, secret_key, { expiresIn: expiresIn });
  const jwtToken = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

  return jwtToken;
};

const saveTokenToCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Setting cookie inside header
};

exports.signup = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const doc = await User.create({
    name: name,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
  });

  if (!doc) {
    res.json({
      message: "signup failed",
    });
  }

  // Sending welcome Email
  const url = `${req.protocol}://${req.get("host")}/me`;

  await new Email(doc, url).sendWelcome();

  // const token = jwt.sign(doc.id, secret_key);
  const token = generateToken(doc.id);
  saveTokenToCookie(token, res);
  res.status(201).json({
    status: "User created",
    token: token,
    data: {
      doc,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({
      data: "fail",
      message: "Either email or password does not exist.",
    });
  }

  const doc = await User.findOne({ email }).select("+password");

  if (!doc || !(await doc.matchPassword(password, doc.password))) {
    res.status(400).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  } else {
    const token = jwt.sign(doc.id, process.env.SECRET_KEY);

    // saveTokenToCookie(token, res);

    const cookieOptions = {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    };
    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      status: "success",
      message: "You are succcessfully logged in...",
    });
  }
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
};

exports.deactivateMe = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.user.id, { active: false });

  if (!doc) return next(new AppError("Updation failed", 400));

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.json({
      message: "Please log in to get access",
    });
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  const currentUser = await User.findById(decoded);

  if (!currentUser) {
    res.json({
      message: "Token invalid",
    });
  }

  res.locals.user = currentUser;
  // req.user = currentUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(res.locals.user.role)) {
      res.status(400).json({
        message: "You are not authorised to access.",
      });
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  let user;
  if (req.body.email) {
    user = await User.findOne({ email: req.body.email });
  } else if (req.user.email) {
    user = await User.findOne({ email: req.user.email });
  }

  if (!user) {
    res.status(400).json({
      message: "User does not exist.",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).passwordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined),
      await user.save({ validateBeforeSave: false });
    res.status(500).json({
      message: "Something went wrong, internal server error.",
    });
  }
  res.json({
    data: user,
  });
});

exports.getme = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;

  next();
});

exports.updatePassword = async (req, res, next) => {
  let id;
  if (res.locals.user) {
    id = res.locals.user.id;
  } else {
    id = res.user.id;
  }
  const user = await User.findById(id).select("+password");

  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
  }
  if (!(await user.matchPassword(req.body.currentPassword, user.password))) {
    res.status(400).json({
      status: "fail",
      message: "Password does not match",
    });
    return next();
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password updated!...",
    data: user,
  });
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.json({
      status: "400",
      message:
        "Token is invalid or expired, please use the forgot-password option again...",
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      if (req.cookies.jwt === "loggedout") {
        return next();
      }
      const token = req.cookies.jwt;

      // validate the token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Find user by decoded id

      const user = await User.findById(decoded);

      // Check if the password is changed or not.

      res.locals.user = user;

      return next();
    }
  } catch (error) {
    res.json(error);
  }
  return next();
};
