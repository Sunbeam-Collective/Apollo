// const mongoose = require('mongoose')
// const dotenv = require('dotenv')
// dotenv.config();

// mongoose
//     .connect(process.env.db_connect, { usenewurlparser: true })
//     .catch(e => {
//         console.error('connection error', e.message)
//     })

// const db = mongoose.connection

// module.exports = db

const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_CONNECT;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

const connect = async () => {
  try {
    await client.connect();
    db = client.db("apollo");
    console.log("Successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
}

module.exports = {
  connect,
  getDb: () => db,
  client
};
