const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // MongoDB URI
const client = new MongoClient(uri);
const dbName = "notion_clone";

let db;

const connectDB = async () => {
  if (!db) {
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
  },
};
