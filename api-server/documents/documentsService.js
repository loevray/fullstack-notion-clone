const { connectDB } = require("../models/db");
const buildTreeFromMaterializedPath = require("./utils/buildTreeFromMaterializedPath");
const getToday = require("./utils/getToday");

const COLLECTION_NAME = "documents";

async function getNextSequenceValue(collectionName) {
  const db = await connectDB();

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
}

async function getDocuments() {
  const db = await connectDB();
  const documents = await db.collection(COLLECTION_NAME).find().toArray();

  return buildTreeFromMaterializedPath(documents);
}

async function getDocumentById(id) {
  const db = await connectDB();

  return await db.collection(COLLECTION_NAME).findOne(
    { _id: +id },
    {
      projection: { _id: 0 },
    }
  );
}

async function createDocument({ parentId = null, title }) {
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

  const result = await db.collection(COLLECTION_NAME).insertOne(newDocument);

  return await getDocumentById(result.insertedId);
}

async function updateDocument({ documentId, newDocument }) {
  const db = await connectDB();

  return await db.collection(COLLECTION_NAME).findOneAndUpdate(
    { _id: +documentId },
    {
      $set: {
        ...newDocument,
        updatedAt: getToday(),
      },
    },
    { returnNewDocument: true }
  );
}

async function getChildDocuments(parentId) {
  const db = await connectDB();

  return await db
    .collection(COLLECTION_NAME)
    .find({
      materializedPath: { $regex: `,${parentId},` },
    })
    .toArray();
}

async function updateDescendantsPath(childDoc, parentId) {
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
  const db = await connectDB();
  const parentDoc = await db
    .collection(COLLECTION_NAME)
    .findOne({ _id: +parentId });

  if (!parentDoc) throw new Error("Parent document not found.");

  return parentDoc;
}

async function generateDocumentPath({ parentId, currentPath }) {
  if (!parentId) return null;

  if (!currentPath) {
    const parentDoc = await findParentDocument(parentId);
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
    throw new Error("Document not found");
  }

  const childDocuments = await getChildDocuments(id);

  if (childDocuments.length > 0) {
    await Promise.all(
      childDocuments.map((childDoc) => updateDescendantsPath(childDoc, id))
    );
  }

  // 문서 삭제
  return await db.collection(COLLECTION_NAME).deleteOne({ _id: +id });
}

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
