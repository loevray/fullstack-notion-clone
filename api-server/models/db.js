const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // MongoDB URI
let client;
const dbName = "notion_clone";

let db;

const connectDB = async () => {
  if (!db) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db(dbName);
  }
  return db;
};

module.exports = {
  connectDB,
  _internal: {
    setDb: (newDb) => {
      db = newDb;
    },
    setClient: (newClient) => {
      client = newClient;
    },
  },
  getClient: () => client,
};
