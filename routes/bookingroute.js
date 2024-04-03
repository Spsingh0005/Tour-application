const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

// // router
// //   .route("/checkout-session/:tourId")
// //   .post(authController.protect, bookingController.getCheckoutSesion);

router
  .route("/create-checkout-session/:tourId")
  .post(bookingController.checkoutSession);

router.route("/create-product/:tourId").post(bookingController.addProduct);
router
  .route("/create-customer")
  .get(authController.isLoggedIn, bookingController.createCustomer);

module.exports = router;
