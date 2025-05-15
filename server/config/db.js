const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://techlabsafrica:TjzilROzB2YRBp4G@vid-share.b2zdqtu.mongodb.net/?retryWrites=true&w=majority&appName=vid-share",
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
