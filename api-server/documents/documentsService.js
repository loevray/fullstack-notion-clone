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

  const document = await db.collection(COLLECTION_NAME).findOne(
    { _id: +id },
    {
      projection: { _id: 0 },
    }
  );

  console.log(document);
  return document;
}

async function createDocument({ parentId = null, title }) {
  const db = await connectDB();

  const nextId = await getNextSequenceValue(COLLECTION_NAME);
  const path = await generateDocumentPath({ parentId });
  const today = getToday();

  const newDocument = {
    _id: nextId,
    id: nextId,
    title,
    content: "",
    path,
    createdAt: today,
    updatedAt: today,
  };

  return await db.collection(COLLECTION_NAME).insertOne(newDocument);
}

async function updateDocument({ documentId, newDocument }) {
  const db = await connectDB();

  return await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: documentId }, { $set: newDocument });
}

async function getChildDocuments(parentId) {
  const db = await connectDB();

  return await db
    .collection(COLLECTION_NAME)
    .find({
      path: { $regex: `,${parentId},` },
    })
    .toArray();
}

async function updateDescendantsPath(childDoc, parentId) {
  // 새로운 경로 생성
  const newPath = await generateDocumentPath({
    parentId,
    currentPath: childDoc.path,
  });

  // 문서 업데이트
  await updateDocument({
    documentId: childDoc._id,
    newDocument: { path: newPath },
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
    return parentDoc.path ? `${parentDoc.path}${parentId},` : `,${parentId},`;
  }

  let newPath = currentPath.replace(`,${parentId},`, ",");
  return newPath === "," ? null : newPath;
}

async function deleteDocument(id) {
  const db = await connectDB();
  const documentToDelete = getDocumentById(id);

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
  return await db.collection(COLLECTION_NAME).deleteOne({ _id: id });
}

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
