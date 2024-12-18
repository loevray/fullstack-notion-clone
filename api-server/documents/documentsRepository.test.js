const { MongoClient } = require("mongodb");

const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} = require("./documentsRepository.js");
const { _internal } = require("../models/db");
const getToday = require("./utils/getToday.js");

const mockDate = new Date(2024, 11, 15, 19, 52, 0);

jest.useFakeTimers({ doNotFake: ["nextTick"] }).setSystemTime(mockDate);

describe("Documents Repository Tests", () => {
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

  // 공통 데이터 생성 함수
  const setupTestData = async () => {
    await createDocument({
      document: {
        title: "제목1",
        content: "내용1",
        createdAt: getToday(),
        updatedAt: getToday(),
      },
    });

    await createDocument({
      parentId: 1,
      document: {
        title: "제목2",
        content: "내용2",
        createdAt: getToday(),
        updatedAt: getToday(),
      },
    });

    await createDocument({
      parentId: 1,
      document: {
        title: "제목3",
        content: "내용3",
        createdAt: getToday(),
        updatedAt: getToday(),
      },
    });

    await createDocument({
      parentId: 3,
      document: {
        title: "제목4",
        content: "내용4",
        createdAt: getToday(),
        updatedAt: getToday(),
      },
    });
  };

  it("should insert a document into the collection", async () => {
    const mockDocument = {
      id: 1,
      title: "제목 인데용?",
      content: "내용 인데용?",
      createdAt: getToday(),
      updatedAt: getToday(),
    };

    await createDocument({ document: mockDocument });

    const insertedDocument = await getDocumentById(1);

    expect({ ...insertedDocument }).toEqual({
      ...mockDocument,
      path: null,
    });
  });

  it("should get document list", async () => {
    await setupTestData();

    const expectedDocumentList = [
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

    const documentList = await getDocuments();
    expect(documentList).toEqual(expectedDocumentList);
  });

  it("should move child documents to upper hierarchy when parentId is deleted", async () => {
    await setupTestData();

    const origin = await getDocuments();

    await deleteDocument(1);

    const expectedDocumentList = [
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

    const documentList = await getDocuments();

    expect(documentList).toEqual(expectedDocumentList);
  });

  it("should update a document", async () => {
    await setupTestData();

    const newDocument = {
      title: "제목4",
      content: "내용444444ㅋㅋㅋ",
      path: ",1,3,",
      createdAt: getToday(),
      updatedAt: getToday(),
    };

    await updateDocument({
      documentId: 4,
      newDocument,
    });

    const updatedDocument = await getDocumentById(4);

    expect(updatedDocument).toEqual({ id: 4, ...newDocument });
  });
});
