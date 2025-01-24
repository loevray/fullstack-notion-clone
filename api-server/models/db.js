require("dotenv").config();

const { MongoClient } = require("mongodb");
const DatabaseError = require("../customErrors/databaseError");

const { MONGODB_URI } = process.env; // MongoDB URI

let client;

const { DatabaseConstants } = require("../constants/database");
const { DATABASE_NAME } = DatabaseConstants;

let db;

const connectDB = async () => {
  try {
    if (!db) {
      client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      db = client.db(DATABASE_NAME);
    }

    return db;
  } catch (e) {
    throw new DatabaseError(`DB연결에 실패했습니다: ${e.message}`);
  }
};

module.exports = connectDB;
