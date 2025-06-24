const mongoose = require("mongoose");

const mongoDB = async () => {
  // I have written username and password directly here, instead of env file.
  const username = "Realestate";
  const password = "realestate";

  const mongoURL = `mongodb+srv://${username}:${password}@realestate.ohbeinv.mongodb.net/?retryWrites=true&w=majority&appName=RealEstate`;

  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Problem connecting Database");
  }
};

module.exports = mongoDB;
