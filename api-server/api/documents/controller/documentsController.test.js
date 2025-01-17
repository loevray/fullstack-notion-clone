const DocumentsController = require("./documentsController");

describe("documents controller integration test", () => {
  let mockDocumentsService;
  let _documentsController;

  beforeEach(() => {
    mockDocumentsService = {
      getDocuments: jest.fn(),
      getDocumentById: jest.fn(),
      createDocument: jest.fn(),
      updateDocument: jest.fn(),
      deleteDocument: jest.fn(),
    };

    _documentsController = new DocumentsController(mockDocumentsService);
  });

  it("get document controller success test", async () => {
    const mockDocument = { id: 1, title: "Test Document" };
    mockDocumentsService.getDocumentById.mockResolvedValue(mockDocument);

    const req = { params: { id: "1" } };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    await _documentsController.getDocumentController(req, res);

    expect(mockDocumentsService.getDocumentById).toHaveBeenCalledWith("1");
    expect(res.writeHead).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockDocument));
  });

  it("get document list controller success test", async () => {
    const mockDocumentList = [
      { id: 1, title: "Test Document" },
      { id: 2, title: "Test Document2" },
    ];

    mockDocumentsService.getDocuments.mockResolvedValue(mockDocumentList);

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    await _documentsController.getDocumentListController(null, res);

    expect(mockDocumentsService.getDocuments).toHaveBeenCalledWith();
    expect(res.writeHead).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(mockDocumentList));
  });

  it("create document controller test", async () => {});

  it("update document controller test", async () => {});

  it("delete document controller test", async () => {});
});
