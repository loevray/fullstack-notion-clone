const { MongoClient } = require("mongodb");

const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("./documentsRepository.js");
const { connectDB, _internal } = require("../models/db");

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db(globalThis.__MONGO_DB_NAME__);

    _internal.setDb(db);

    await db
      .collection("counters")
      .insertOne({ _id: "documents", sequence_value: 0 });
  });

  beforeEach(async () => {
    await db.collection("documents").deleteMany({});
    await db.collection("counters").deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should insert a doc into collection", async () => {
    const mockDocument = {
      title: "제목 인데용?",
      content: "내용 인데용?",
      createdAt: "2024-12-15-19:52:00",
      updatedAt: "2024-12-15-19:52:00",
    };

    const data = await db
      .collection("counters")
      .find({ _id: "documents" })
      .toArray();

    await createDocument({ document: mockDocument });

    const insertedUser = await getDocumentById(1);

    expect(insertedUser).toEqual({ ...mockDocument, id: 1, _id: 1 });
  });
});
