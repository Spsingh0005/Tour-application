const Test = require("../models/testModel");

exports.createOne = async (req, res) => {
  const doc = await Test.create({
    name: "Test-Name",
    description: "This is a test description",
  });

  res.json({
    status: 200,
    data: doc,
  });
};

exports.getAll = async (req, res) => {
  const docs = await Test.find();

  res.json({
    status: 200,
    data: {
      docs,
    },
  });
};

exports.updateOne = async (req, res) => {
  const id = "65fb7fc01b03fa576671ebc6";
  const doc = await Test.findByIdAndUpdate(id, { name: "Test-Name-1" });

  await doc.save();

  res.json({
    status: 200,
    message: "updated",
  });
};

exports.deleteOne = async (req, res) => {
  const id = "65fb7fc01b03fa576671ebc6";
  const doc = await Test.findByIdAndDelete(id);

  res.json({
    status: 200,
    message: "deleted",
    data: doc,
  });
};
