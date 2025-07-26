const mongoose = require("mongoose");
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Use a module-scoped cache instead of global
let cachedConn = null;
let cachedPromise = null;

async function dbConnect() {
  if (cachedConn) return cachedConn;
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  cachedConn = await cachedPromise;
  // Optional: log connection events for Express
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  return cachedConn;
}

module.exports = dbConnect;

