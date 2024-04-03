const stripe = require("stripe")(
  "sk_test_51P0RgpSJykh9bpMIXQVjM0jVZknYT78yVvxBhpQRJ9tpKKqdTDw5OA3nwYdUwDEGaVdjy1FYlD1ARwAEXEjPno7t00vZMC2xTE"
);
const express = require("express");
const Tour = require("../models/tourModel");
const app = express();
app.use(express.static("public"));

exports.getSession = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: tour._id,
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
  });

  res.send({ clientSecret: session.client_secret });
};

// const catchAsync = require("../util/catchAsync");
// const stripe = require("stripe")(
//   "sk_test_51P0RgpSJykh9bpMIXQVjM0jVZknYT78yVvxBhpQRJ9tpKKqdTDw5OA3nwYdUwDEGaVdjy1FYlD1ARwAEXEjPno7t00vZMC2xTE"
// );
// const stripe = require("stripe");
// const Tour = require("../models/tourModel");

// exports.getCheckoutSesion = catchAsync(async (req, res, next) => {
//   //1.  Find tour by tourid
//   console.log(process.env.STRIPE_SECRET_KEY);
//   const tour = await Tour.findById(req.params.tourId);

//   //2.Save session into a separate variable

//   const stripeSession = await stripe.checkout.sessions.create({
//     mode: "setup",
//     success_url: `${req.protocol}://${req.get("host")}`,
//     cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
//     customer_email: res.locals.user.email,
//     client_reference_id: req.params.tourId,
//     currency: "inr",
//     amount_total: tour.price,
//     shipping_cost: tour.price,
//   });

//   console.log(stripeSession);

//   res.json({
//     data: stripeSession,
//   });
// });

// const product = await stripe.products.create({
//   name: "First gift",
//   description: "Gift product for special ocassions",
//   unit_label: 100,
// });
// const price = await stripe.prices.create({
//   currency: "usd",
//   unit_amount: 1000,
//   recurring: {
//     interval: "month",
//   },
//   product_data: {
//     name: "Gold Plan",
//   },
// });

// const prices = await stripe.prices.list({
//   limit: 3,
// });

exports.addProduct = async (req, res, next) => {
  try {
    // Finding tour is here.
    const tour = await Tour.findById(req.params.tourId);

    const product = await stripe.products.create({
      name: tour.name,
      description: tour.summary,
    });

    const priceObj = await stripe.prices.create({
      product: product.id,
      unit_amount: tour.price * 100,
      currency: "USD",
    });

    console.log(product), console.log(priceObj);
    res.status(200).json({
      status: "success",
      product: product,
      productPrice: priceObj,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  console.log("inside create customer function ");
  console.log(res.locals);
  const { email, name } = res.locals.user;
  console.log(email, name);
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    console.log("Customer created" + customer);
    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.checkoutSession = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    console.log(tour.name);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: tour.name,
            },
            unit_amount: tour.price, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/`,
    });
    console.log(session);
    res.status(200).json({
      data: "success",
      product: tour.slug,
      session,
      sessionId: session.id,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// {
//   "id": "prod_PqipXyQwSM6TY6",
//   "object": "product",
//   "active": true,
//   "attributes": [],
//   "created": 1712041433,
//   "default_price": null,
//   "description": "Gift product for special ocassions",
//   "features": [],
//   "images": [],
//   "livemode": false,
//   "metadata": {},
//   "name": "Gift Plan",
//   "package_dimensions": null,
//   "shippable": null,
//   "statement_descriptor": null,
//   "tax_code": null,
//   "type": "service",
//   "unit_label": null,
//   "updated": 1712041433,
//   "url": null
// }

// Api for product and price

// const product = await stripe.products.create({
//   name: 'Basic Dashboard',
//   default_price_data: {
//     unit_amount: 1000,
//     currency: 'usd',
//     recurring: {
//       interval: 'month',
//     },
//   },
//   expand: ['default_price'],
// });

// Product Api
// 1.Create a product

// stripe.products.create

// 2.Edit a product

// stripe.products.update

// 3.Delete a product

// stripe.products.del('tourId')

// 4.Achieve a product

// stripe.products.create({
//   active:false,
// })

// Price Api
// 1.Create price

// stripe.prices.create;

// 2.Edit a price

// stripe.prices.update;

// 3.Delete a price

// can't delete price (only archieve)
// 4.Achieve a price

// exports.getSession = async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: "T-shirt",
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: "http://localhost:3000/",
//     cancel_url: "http://localhost:3000/",
//   });
//   res.json(session);
// };

// Working of stripe integration

// 1. Sign Up for stripe.
// 2. Install stripe package.
// 3. Set up your Api keys
// 4. Require Nodejs Application
// 5. Create a payment intent
// 6. Handle payment confirmation
// 7. Client side integration
// 8. Handle webhooks

// Functions
// 1. addProduct
// 2. create-checkout-session
// 3.
