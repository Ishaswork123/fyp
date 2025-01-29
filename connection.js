// const mongoose=require('mongoose');

// async function connectToMongoBb(url){
//     return mongoose.connect(url);
// }
const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb://127.0.0.1:27017/fyp";
let db;

async function connectToMongo() {
  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process if connection fails
  }
}

module.exports = { connectToMongo, getDb: () => db };


