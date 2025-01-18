const { MongoClient } = require("mongodb");

const getToday = require("../utils/getToday.js");
const DocumentsService = require("./documentsService.js");
const DocumentsRepository = require("../repository/documentsRepository.js");

const mockDate = new Date(2024, 11, 15, 19, 52, 0);

jest.useFakeTimers({ doNotFake: ["nextTick"] }).setSystemTime(mockDate);

describe("Document Service tests", () => {
  let connection;
  let db;
  let documentsService;
  let createDocument,
    getDocuments,
    deleteDocument,
    updateDocument,
    getDocumentById;
  let setupTestData;

  beforeAll(async () => {
    connection = await MongoClient.connect(globalThis.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = await connection.db(globalThis.__MONGO_DB_NAME__);

    const documentsRepository = new DocumentsRepository(db);
    documentsService = new DocumentsService(documentsRepository);

    createDocument = documentsService.createDocument.bind(documentsService);
    getDocuments = documentsService.getDocuments.bind(documentsService);
    deleteDocument = documentsService.deleteDocument.bind(documentsService);
    updateDocument = documentsService.updateDocument.bind(documentsService);
    getDocumentById = documentsService.getDocumentById.bind(documentsService);

    setupTestData = async () => {
      await createDocument({
        title: "제목1",
      });

      await createDocument({
        parentId: 1,
        title: "제목2",
      });

      await createDocument({
        parentId: 1,
        title: "제목3",
      });

      await createDocument({
        parentId: 3,
        title: "제목4",
      });
    };
  });

  beforeEach(async () => {
    await db.collection("documents").deleteMany({});
    await db.collection("counters").deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  // 공통 데이터 생성 함수

  it("should insert a document into the collection", async () => {
    const mockDocument = {
      id: 1,
      title: "제목 없음",
      content: "",
      createdAt: "2024-12-15-19:52:00",
      updatedAt: "2024-12-15-19:52:00",
      materializedPath: null,
    };

    const createdDocument = await createDocument({});

    expect(createdDocument).toEqual(mockDocument);
  });

  it("should get document list", async () => {
    await setupTestData();

    const expectedDocumentList = [
      {
        id: 1,
        title: "제목1",
        materializedPath: null,
        documents: [
          {
            id: 2,
            title: "제목2",
            documents: [],
            materializedPath: ",1,",
          },
          {
            id: 3,
            title: "제목3",
            materializedPath: ",1,",
            documents: [
              {
                id: 4,
                title: "제목4",
                documents: [],
                materializedPath: ",1,3,",
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

    await deleteDocument(1);

    const expectedDocumentList = [
      {
        id: 2,
        title: "제목2",
        documents: [],
        materializedPath: null,
      },
      {
        id: 3,
        title: "제목3",
        materializedPath: null,
        documents: [
          {
            id: 4,
            title: "제목4",
            documents: [],
            materializedPath: ",3,",
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
      materializedPath: ",1,3,",
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
