const { MongoClient } = require("mongodb");

const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("./documentsRepository.js");
const { _internal } = require("../models/db");

const mockDate = new Date(2024, 11, 15, 19, 52, 0);

jest.useFakeTimers({ doNotFake: ["nextTick"] }).setSystemTime(mockDate);

describe("insert", () => {
  let client;
  let connection;
  let db;

  beforeAll(async () => {
    client = new MongoClient(globalThis.__MONGO_URI__);

    connection = await client.connect({
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = connection.db(globalThis.__MONGO_DB_NAME__);
    _internal.setClient(client);
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

    await createDocument({ document: mockDocument });

    const insertedUser = await getDocumentById(1);

    expect(insertedUser).toEqual({
      ...mockDocument,
      id: 1,
      path: null,
    });
  });

  it("should get document list", async () => {
    const mockDocumentList = [
      {
        id: 1,
        title: "제목1",
        path: null,
        documents: [
          {
            id: 2,
            title: "제목2",
            documents: [],
            path: ",1,",
          },
          {
            id: 3,
            title: "제목3",
            path: ",1,",
            documents: [
              {
                id: 4,
                title: "제목4",
                documents: [],
                path: ",1,3,",
              },
            ],
          },
        ],
      },
    ];

    await createDocument({
      document: {
        title: "제목1",
        content: "내용1",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 1,
      document: {
        title: "제목2",
        content: "내용2",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 1,
      document: {
        title: "제목3",
        content: "내용3",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 3,
      document: {
        title: "제목4",
        content: "내용4",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    const documentList = await getDocuments();

    expect(documentList).toEqual(mockDocumentList);
  });

  it("should child document up to upper hierarchy", async () => {
    const mockDocumentList = [
      {
        id: 2,
        title: "제목2",
        documents: [],
        path: null,
      },
      {
        id: 3,
        title: "제목3",
        path: null,
        documents: [
          {
            id: 4,
            title: "제목4",
            documents: [],
            path: ",3,",
          },
        ],
      },
    ];

    await createDocument({
      document: {
        title: "제목1",
        content: "내용1",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 1,
      document: {
        title: "제목2",
        content: "내용2",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 1,
      document: {
        title: "제목3",
        content: "내용3",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 3,
      document: {
        title: "제목4",
        content: "내용4",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await deleteDocument(1);

    const documentList = await getDocuments();

    expect(documentList).toEqual(mockDocumentList);
  });

  it("should updated document", async () => {
    const mockDocument = {
      id: 4,
      title: "제목4",
      content: "내용444444ㅋㅋㅋ",
      path: ",1,3,",
      createdAt: "2024-12-15-19:52:00",
      updatedAt: "2024-12-15-19:52:00",
    };

    await createDocument({
      document: {
        title: "제목1",
        content: "내용1",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 1,
      document: {
        title: "제목2",
        content: "내용2",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 1,
      document: {
        title: "제목3",
        content: "내용3",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await createDocument({
      parent: 3,
      document: {
        title: "제목4",
        content: "내용4",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    await updateDocument({
      id: 4,
      newDocument: {
        title: "제목4",
        content: "내용444444ㅋㅋㅋ",
        path: ",1,3,",
        createdAt: "2024-12-15-19:52:00",
        updatedAt: "2024-12-15-19:52:00",
      },
    });

    const updatedDocument = await getDocumentById(4);

    expect(updatedDocument).toEqual(mockDocument);
  });
});
