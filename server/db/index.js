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
const uri = `mongodb+srv://admin:${process.env.DB_PASSWORD}@apollo-1.i81vo.mongodb.net/?retryWrites=true&w=majority&appName=Apollo-1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = run;

// run().catch(console.dir);
