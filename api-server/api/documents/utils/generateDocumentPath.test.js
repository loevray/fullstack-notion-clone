const generateDocumentPath = require("./generateDocumentPath");

describe("generateDocumentPath unit test", () => {
  it("should return null if parentId is null", () => {
    const path = generateDocumentPath({ parentId: null });
    expect(path).toBeNull();
  });

  it("should generate correct path for root document", () => {
    const path = generateDocumentPath({
      parentId: 1,
      currentPath: null,
    });

    expect(path).toBe(",1,");
  });

  it("should generate correct path for child document", () => {
    const path = generateDocumentPath({
      parentId: 3,
      parentPath: ",1,4,7,",
    });

    expect(path).toBe(",1,4,7,3,");
  });

  it("should update path correctly when ancestor document is deleted", () => {
    const path = generateDocumentPath({
      parentId: 1,
      parentPath: ",1,",
      currentPath: ",1,2,3,",
    });

    expect(path).toBe(",2,3,");
  });
});
