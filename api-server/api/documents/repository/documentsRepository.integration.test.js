const { MongoClient } = require("mongodb");

const { DatabaseConstants } = require("../../../constants/database");
const DocumentsRepository = require("./documentsRepository");

const { DOCUMENTS_COLLECTION, COUNTERS_COLLECTION, SEQUENCE_VALUE } =
  DatabaseConstants;

describe("DocumentsRepository Tests", () => {
  let connection;
  let db;
  let documentsRepository;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = await connection.db(globalThis.__MONGO_DB_NAME__);

    documentsRepository = new DocumentsRepository(db);
  });

  beforeEach(async () => {
    await db.collection(DOCUMENTS_COLLECTION).deleteMany({});
    await db.collection(COUNTERS_COLLECTION).deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it("get new Document Id", async () => {
    const result = [];
    const count = Array(5).fill(null);
    for await (const _ of count) {
      const newId = (await documentsRepository.getNewDocumentId())[
        SEQUENCE_VALUE
      ];
      result.push(newId);
    }

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("create and get document by id", async () => {
    const newDocument = {
      _id: 1,
      title: "Test Document",
      content: "This is a test document.",
      materializedPath: "1,",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await documentsRepository.createDocument(newDocument);
    const fetchedDocument = await documentsRepository.getDocumentById(1);

    expect(fetchedDocument).toEqual({
      title: "Test Document",
      content: "This is a test document.",
      materializedPath: "1,",
      createdAt: newDocument.createdAt,
      updatedAt: newDocument.updatedAt,
    });
  });

  it("update document", async () => {
    const newDocument = {
      _id: 1,
      title: "Test Document",
      content: "This is a test document.",
      materializedPath: "1,",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await documentsRepository.createDocument(newDocument);

    const updatedDocument = {
      title: "Updated Document",
      content: "This is an updated test document.",
      updatedAt: new Date(),
    };

    await documentsRepository.updateDocument(1, updatedDocument);
    const fetchedDocument = await documentsRepository.getDocumentById(1);

    expect(fetchedDocument).toEqual({
      title: "Updated Document",
      content: "This is an updated test document.",
      materializedPath: "1,",
      createdAt: newDocument.createdAt,
      updatedAt: updatedDocument.updatedAt,
    });
  });

  it("get all documents", async () => {
    const documents = [
      {
        _id: 1,
        title: "Document 1",
        content: "Content 1",
        materializedPath: "1,",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 2,
        title: "Document 2",
        content: "Content 2",
        materializedPath: "2,",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await documentsRepository.createDocument(documents[0]);
    await documentsRepository.createDocument(documents[1]);

    const fetchedDocuments = await documentsRepository.getDocuments();

    expect(fetchedDocuments).toEqual(documents);
  });
});
