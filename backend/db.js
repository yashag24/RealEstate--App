const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables

const mongoDB = async () => {
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;

  const mongoURL = `mongodb+srv://${username}:${password}@realestateapp.nbwruwp.mongodb.net/RealEstateApp?retryWrites=true&w=majority&appName=RealEstateApp`;
 
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Problem connecting Database", err);
  }
};

module.exports = mongoDB;
