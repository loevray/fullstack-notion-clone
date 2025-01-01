const { connectDB } = require("../models/db");
const DatabaseError = require("./customErrors/databaseError");
const NotFoundError = require("./customErrors/notFoundError");
const ValidationError = require("./customErrors/validationError");
const buildTreeFromMaterializedPath = require("./utils/buildTreeFromMaterializedPath");
const getToday = require("./utils/getToday");

const COLLECTION_NAME = "documents";

async function getNextSequenceValue(collectionName) {
  const db = await connectDB();

  try {
    const result = await db.collection("counters").findOneAndUpdate(
      { _id: collectionName },
      { $inc: { sequence_value: 1 } },
      {
        returnDocument: "after",
        returnOriginal: false,
        upsert: true,
        projection: { sequence_value: 1 },
      }
    );

    return result.sequence_value;
  } catch (e) {
    throw new DatabaseError(`Failed to get next sequence value: ${e.message}`);
  }
}

async function getDocuments() {
  const db = await connectDB();

  try {
    const documents = await db.collection(COLLECTION_NAME).find().toArray();

    return buildTreeFromMaterializedPath(documents);
  } catch (e) {
    throw new DatabaseError(`Failed to get documents: ${e.message}`);
  }
}

async function getDocumentById(id) {
  const db = await connectDB();

  try {
    const document = await db.collection(COLLECTION_NAME).findOne(
      { _id: +id },
      {
        projection: { _id: 0 },
      }
    );

    if (!document)
      throw new NotFoundError(`${id}번째 문서를 찾을 수 없습니다!`);
  } catch (e) {
    throw new DatabaseError(`Failed to get document: ${e.message}`);
  }
}

async function createDocument({ parentId = null, title }) {
  if (title.length >= 20) {
    throw new ValidationError("제목은 20자 이하여야 합니다.");
  }

  const db = await connectDB();
  const nextId = await getNextSequenceValue(COLLECTION_NAME);
  const materializedPath = await generateDocumentPath({ parentId });
  const today = getToday();

  const newDocument = {
    _id: nextId,
    id: nextId,
    title,
    content: "",
    materializedPath,
    createdAt: today,
    updatedAt: today,
  };

  let result;

  try {
    result = await db.collection(COLLECTION_NAME).insertOne(newDocument);
  } catch (e) {
    throw new DatabaseError(`Failed to create document: ${e.message}`);
  }

  return getDocumentById(result.insertedId);
}

async function updateDocument({ documentId, newDocument }) {
  const db = await connectDB();

  try {
    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
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
      .collection(COLLECTION_NAME)
      .find({
        materializedPath: { $regex: `,${parentId},` },
      })
      .toArray();
  } catch (e) {
    throw new DatabaseError(`Failed to get child documents: ${e.message}`);
  }
}

async function updateDescendantsPath(childDoc, parentId) {
  //트랜잭션을 사용하여 업데이트를 안전하게 처리하는 방안 필요.

  // 새로운 경로 생성
  const newPath = await generateDocumentPath({
    parentId,
    currentPath: childDoc.materializedPath,
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
        updateDescendantsPath(grandChild, parentId)
      )
    );
  }
}

async function findParentDocument(parentId) {
  //parentId !== null

  if (!parentId) return null;

  const db = await connectDB();

  try {
    const parentDoc = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: +parentId });

    if (!parentDoc)
      throw new NotFoundError(`부모 문서${parentId}를 찾을 수 없습니다!`);

    return parentDoc;
  } catch (e) {
    throw new DatabaseError(`Failed to find parent document: ${e.message}`);
  }
}

async function generateDocumentPath({ parentId, currentPath }) {
  if (!parentId) return null;

  if (!currentPath) {
    const parentDoc = await findParentDocument(parentId);
    if (!parentDoc)
      return parentDoc.materializedPath
        ? `${parentDoc.materializedPath}${parentId},`
        : `,${parentId},`;
  }

  let newPath = currentPath.replace(`,${parentId},`, ",");
  return newPath === "," ? null : newPath;
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
      childDocuments.map((childDoc) => updateDescendantsPath(childDoc, id))
    );
  }

  // 문서 삭제
  try {
    return await db.collection(COLLECTION_NAME).deleteOne({ _id: +id });
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
