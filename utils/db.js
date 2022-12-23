const debug = require("debug")("bug-tracker:server");
const mongoose = require("mongoose");
const logs = require("./logs");

exports.connectToDb = async () => {
  const DB = process.env.DB_URL;
  let time = new Date()
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DB).then(() => debug("DB connection successful!"));
    logs.addToLog("info", "Connected to DB", null)
  } catch (err) {
    logs.addToLog("error", "MongoDB Connection Error", err.message)
    console.log(err.message); 
  }
};
