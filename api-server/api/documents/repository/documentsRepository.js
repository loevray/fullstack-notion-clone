const { DatabaseConstants } = require("../../../constants/database");

const { DOCUMENTS_COLLECTION, COUNTERS_COLLECTION, SEQUENCE_VALUE } =
  DatabaseConstants;

class DocumentsRepository {
  constructor(db) {
    this.db = db;
  }
  async getNewDocumentId() {
    return await this.db.collection(COUNTERS_COLLECTION).findOneAndUpdate(
      { _id: DOCUMENTS_COLLECTION },
      { $inc: { [SEQUENCE_VALUE]: 1 } },
      {
        returnDocument: "after",
        returnOriginal: false,
        upsert: true,
        projection: { [SEQUENCE_VALUE]: 1 },
      }
    );
  }

  async getDocuments() {
    return await this.db.collection(DOCUMENTS_COLLECTION).find().toArray();
  }

  async getDocumentById(id) {
    return await this.db.collection(DOCUMENTS_COLLECTION).findOne(
      { _id: +id },
      {
        projection: { _id: 0 },
      }
    );
  }

  async createDocument(document) {
    return await this.db.collection(DOCUMENTS_COLLECTION).insertOne(document);
  }

  async updateDocument(id, newDocument) {
    return await this.db
      .collection(DOCUMENTS_COLLECTION)
      .findOneAndUpdate(
        { _id: +id },
        { $set: newDocument },
        { returnNewDocument: true }
      );
  }

  async deleteDocument(id) {
    return await this.db
      .collection(DOCUMENTS_COLLECTION)
      .deleteOne({ _id: +id });
  }

  async getChildDocuments(parentId) {
    return await this.db
      .collection(DOCUMENTS_COLLECTION)
      .find({
        materializedPath: { $regex: `,${parentId},` },
      })
      .toArray();
  }
}

module.exports = DocumentsRepository;
