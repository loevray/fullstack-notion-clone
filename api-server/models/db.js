const { MongoClient } = require("mongodb");
const DatabaseError = require("../customErrors/databaseError");

const uri = "mongodb://localhost:27017"; // MongoDB URI
let client;
const { DatabaseConstants } = require("../constants/database");
const { DATABASE_NAME } = DatabaseConstants;

let db;

const connectDB = async () => {
  try {
    if (!db) {
      client = new MongoClient(uri, {
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
