const { connectDB } = require("../../../models/db");
const DatabaseError = require("../../../customErrors/databaseError");
const NotFoundError = require("../../../customErrors/notFoundError");
const ValidationError = require("../../../customErrors/validationError");
const buildTreeFromMaterializedPath = require("../utils/buildTreeFromMaterializedPath");
const getToday = require("../utils/getToday");
const { DatabaseConstants } = require("../../../constants/database");
const { DocumentConstants } = require("../../../constants/document");
const generateDocumentPath = require("../utils/generateDocumentPath");

const { DOCUMENTS_COLLECTION } = DatabaseConstants;

const { DEFAULT_CONTENT, DEFAULT_TITLE } = DocumentConstants;

class DocumentsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getDocuments() {
    try {
      const documents = await this.repository.getDocuments();
      return buildTreeFromMaterializedPath(documents);
    } catch (e) {
      throw new DatabaseError(`Failed to get documents: ${e.message}`);
    }
  }

  async getDocumentById(id) {
    try {
      const document = this.repository.getDocumentById(id);
      if (!document) {
        throw new NotFoundError(`${id}번째 문서를 찾을 수 없습니다!`);
      }
      return document;
    } catch (e) {
      throw new DatabaseError(`Failed to get document: ${e.message}`);
    }
  }

  async createDocument({ title = DEFAULT_TITLE, parentId = null }) {
    const newId = await this.repository.getNewDocumentId();

    let parentDoc;
    if (parentId) parentDoc = await this.repository.getDocumentById(parentId);

    const materializedPath = generateDocumentPath({
      parentId,
      parentPath: parentDoc?.materializedPath,
    });

    const today = getToday();

    const newDocument = {
      _id: newId,
      id: newId,
      title,
      content: DEFAULT_CONTENT,
      materializedPath,
      createdAt: today,
      updatedAt: today,
    };

    let result;

    try {
      result = await this.repository.createDocument(newDocument);
    } catch (e) {
      throw new DatabaseError(`Failed to create document: ${e.message}`);
    }

    return await this.repository.getDocumentById(result.insertedId);
  }

  async updateDocument({ documentId, newDocument }) {
    if (newDocument.title?.length >= 20) {
      throw new ValidationError("제목은 20자 이하여야 합니다.");
    }

    const newDocumentWithUpdatedAt = {
      ...newDocument,
      updatedAt: getToday(),
    };

    try {
      return await this.repository.updateDocument(
        documentId,
        newDocumentWithUpdatedAt
      );
    } catch (e) {
      throw new DatabaseError(`Failed to update document: ${e.message}`);
    }
  }

  async updateChildMaterializedPath(parentDoc, childDoc) {
    const newPath = generateDocumentPath({
      parentId: parentDoc.id,
      childPath: childDoc.materializedPath,
      parentPath: parentDoc.materializedPath,
    });

    // 문서 업데이트
    await this.repository.updateDocument({
      documentId: childDoc._id,
      newDocument: { materializedPath: newPath },
    });
  }

  async deleteDocument(id) {
    const db = await connectDB();
    const documentToDelete = await getDocumentById(id);

    if (!documentToDelete) {
      throw new NotFoundError(`${id}번째 문서를 찾을 수 없습니다!`);
    }

    const childDocuments = await this.repository.getChildDocuments(id);

    //트랜잭션 이용해서 자식 경로 안전하게 처리하는 방법이 필요
    if (childDocuments.length > 0) {
      await Promise.all(
        childDocuments.map((childDoc) =>
          updateChildMaterializedPath(documentToDelete, childDoc)
        )
      );
    }

    // 문서 삭제
    try {
      return await db.collection(DOCUMENTS_COLLECTION).deleteOne({ _id: +id });
    } catch (e) {
      throw new DatabaseError(`Failed to delete document: ${e.message}`);
    }
  }
}

module.exports = DocumentsService;
