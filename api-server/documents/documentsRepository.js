const connectDB = require("../models/db");

const COLLECTION_NAME = "documents";

async function getDocuments(query = {}) {
  const db = await connectDB();
  return await db.collection(COLLECTION_NAME).find(query).toArray();
}

async function getDocumentById(id) {
  const db = await connectDB();
  return await db.collection(COLLECTION_NAME).findOne({ _id: id });
}

async function createDocument(document) {
  const db = await connectDB();
  return await db.collection(COLLECTION_NAME).insertOne(document);
}

async function updateDocument({ id, newDocument }) {
  const db = await connectDB();

  return await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: id }, { $set: newDocument });
}

async function deleteDocument(id) {
  const db = await connectDB();

  return await db.collection(COLLECTION_NAME).deleteOne({ _id: id });
}

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
