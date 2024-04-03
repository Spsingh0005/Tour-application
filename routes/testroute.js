const express = require("express");
const app = express();
const testController = require("../controllers/testController");

app.route("/test").get(testController.createOne);

app.route("/all-tests").get(testController.getAll);

app.route("/updateOne").patch(testController.updateOne);

app.route("/deleteOne").delete(testController.deleteOne);

module.exports = app;
