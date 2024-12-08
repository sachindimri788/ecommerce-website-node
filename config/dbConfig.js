require("dotenv").config();
const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to the database");
  } catch (e) {
    console.error("Error connecting to the database:", e);
  }
}

module.exports = dbConnect();
