const { connectDB } = require("../../../models/db");
const DatabaseError = require("../../../customErrors/databaseError");
const NotFoundError = require("../../../customErrors/notFoundError");
const ValidationError = require("../../../customErrors/validationError");
const buildTreeFromMaterializedPath = require("../utils/buildTreeFromMaterializedPath");
const getToday = require("../utils/getToday");
const { DatabaseConstants } = require("../../../constants/database");
const { DocumentConstants } = require("../../../constants/document");
const generateDocumentPath = require("../utils/generateDocumentPath");

const { DOCUMENTS_COLLECTION, COUNTERS_COLLECTION, SEQUENCE_VALUE } =
  DatabaseConstants;

const { DEFAULT_CONTENT, DEFAULT_TITLE } = DocumentConstants;

async function getNextSequenceValue(collectionName) {
  const db = await connectDB();

  try {
    const result = await db.collection(COUNTERS_COLLECTION).findOneAndUpdate(
      { _id: collectionName },
      { $inc: { [SEQUENCE_VALUE]: 1 } },
      {
        returnDocument: "after",
        returnOriginal: false,
        upsert: true,
        projection: { [SEQUENCE_VALUE]: 1 },
      }
    );

    return result[SEQUENCE_VALUE];
  } catch (e) {
    throw new DatabaseError(`Failed to get next sequence value: ${e.message}`);
  }
}

async function getDocuments() {
  const db = await connectDB();

  try {
    const documents = await db
      .collection(DOCUMENTS_COLLECTION)
      .find()
      .toArray();

    return buildTreeFromMaterializedPath(documents);
  } catch (e) {
    throw new DatabaseError(`Failed to get documents: ${e.message}`);
  }
}

async function getDocumentById(id) {
  const db = await connectDB();

  try {
    const document = await db.collection(DOCUMENTS_COLLECTION).findOne(
      { _id: +id },
      {
        projection: { _id: 0 },
      }
    );

    if (!document)
      throw new NotFoundError(`${id}번째 문서를 찾을 수 없습니다!`);

    return document;
  } catch (e) {
    throw new DatabaseError(`Failed to get document: ${e.message}`);
  }
}

async function createDocument({ parentId = null }) {
  const db = await connectDB();
  const nextId = await getNextSequenceValue(DOCUMENTS_COLLECTION);

  let parentDoc;
  if (parentId) parentDoc = await getDocumentById(parentId);

  const materializedPath = generateDocumentPath({
    parentId,
    parentPath: parentDoc?.materializedPath,
  });

  const today = getToday();

  const newDocument = {
    _id: nextId,
    id: nextId,
    title: DEFAULT_TITLE,
    content: DEFAULT_CONTENT,
    materializedPath,
    createdAt: today,
    updatedAt: today,
  };

  let result;

  try {
    result = await db.collection(DOCUMENTS_COLLECTION).insertOne(newDocument);
  } catch (e) {
    throw new DatabaseError(`Failed to create document: ${e.message}`);
  }

  return await getDocumentById(result.insertedId);
}

async function updateDocument({ documentId, newDocument }) {
  const db = await connectDB();
  if (newDocument.title.length >= 20) {
    throw new ValidationError("제목은 20자 이하여야 합니다.");
  }

  try {
    const result = await db.collection(DOCUMENTS_COLLECTION).findOneAndUpdate(
      { _id: +documentId },
      {
        $set: {
          ...newDocument,
          updatedAt: getToday(),
        },
      },
      { returnNewDocument: true }
    );
    return result;
  } catch (e) {
    throw new DatabaseError(`Failed to update document: ${e.message}`);
  }
}

async function getChildDocuments(parentId) {
  const db = await connectDB();

  try {
    return await db
      .collection(DOCUMENTS_COLLECTION)
      .find({
        materializedPath: { $regex: `,${parentId},` },
      })
      .toArray();
  } catch (e) {
    throw new DatabaseError(`Failed to get child documents: ${e.message}`);
  }
}

async function updateDescendantsPath(parentDoc, childDoc) {
  //트랜잭션을 사용하여 업데이트를 안전하게 처리하는 방안 필요.

  // 새로운 경로 생성

  const newPath = generateDocumentPath({
    parentId: parentDoc._id,
    currentPath: childDoc.materializedPath,
    parentPath: parentDoc.materializedPath,
  });

  // 문서 업데이트
  await updateDocument({
    documentId: childDoc._id,
    newDocument: { materializedPath: newPath },
  });

  // 자식 문서 재귀 처리
  const grandChildren = await getChildDocuments(childDoc._id);

  if (grandChildren.length > 0) {
    await Promise.all(
      grandChildren.map((grandChild) =>
        updateDescendantsPath(childDoc, grandChild)
      )
    );
  }
}

async function deleteDocument(id) {
  const db = await connectDB();
  const documentToDelete = await getDocumentById(id);

  if (!documentToDelete) {
    throw new NotFoundError(`${id}번째 문서를 찾을 수 없습니다!`);
  }

  const childDocuments = await getChildDocuments(id);

  if (childDocuments.length > 0) {
    await Promise.all(
      childDocuments.map((childDoc) =>
        updateDescendantsPath(documentToDelete, childDoc)
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

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
