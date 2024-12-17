const { connectDB, client, getClient } = require("../models/db");
const {
  buildTreeFromMaterializedPath,
} = require("./utils/buildTreeFromMaterializedPath");
const { getToday } = require("./utils/getToday");

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
  const documentsTree = buildTreeFromMaterializedPath(documents);

  return documentsTree;
}

async function getDocumentById(id) {
  const db = await connectDB();
  return await db.collection(COLLECTION_NAME).findOne(
    { _id: id },
    {
      projection: { _id: 0 },
    }
  );
}

async function createDocument({ parent = null, document }) {
  const db = await connectDB();

  const nextId = await getNextSequenceValue(COLLECTION_NAME);

  let path = null;

  if (parent) {
    // 부모 문서의 path를 가져와 새 path를 생성
    const parentDoc = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: parent });

    if (!parentDoc) {
      throw new Error("Parent document not found.");
    }

    path = parentDoc.path ? `${parentDoc.path}${parent},` : `,${parent},`;
  }

  const today = getToday();

  const newDocument = {
    _id: nextId,
    id: nextId,
    ...document,
    path,
    createdAt: today,
    updatedAt: today,
  };

  return await db.collection(COLLECTION_NAME).insertOne(newDocument);
}

async function updateDocument({ id, newDocument }) {
  const db = await connectDB();

  const updatedDocument = { ...newDocument, updatedAt: getToday() };
  return await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: id }, { $set: updatedDocument });
}

async function deleteDocument(id) {
  async function updateChildPaths(childDoc) {
    let newPath = childDoc.path.replace(`,${id},`, ",");
    if (newPath === ",") newPath = null;

    // path 업데이트
    await documentsColl.updateOne(
      { _id: childDoc._id },
      { $set: { path: newPath } }
    );

    // 자식 문서가 있으면 재귀적으로 처리
    const grandChildrenDocuments = await documentsColl
      .find({
        path: { $regex: `,${childDoc._id},` }, // 자식 문서들 찾기
      })
      .toArray();

    for (const grandChild of grandChildrenDocuments) {
      await updateChildPaths(grandChild); // 재귀 호출
    }
  }

  const db = await connectDB();
  const documentsColl = await db.collection(COLLECTION_NAME);

  try {
    // 삭제할 문서 찾기
    const documentToDelete = await documentsColl.findOne({ _id: id });

    if (!documentToDelete) {
      throw new Error("Document not found");
    }

    // 삭제할 문서의 id를 저장한다
    const parentId = documentToDelete.parentId;

    // 삭제할 문서의 id를 path로 갖고 있는 하위 문서들을 가져온다
    const childrenDocuments = await documentsColl
      .find({
        path: { $regex: `,${id},` }, // path 내에서 삭제할 ID가 포함된 문서들 찾기
      })
      .toArray();

    // 하위 문서들의 path를 재귀적으로 업데이트

    // 각 자식 문서에 대해 재귀적으로 업데이트
    for (const childDoc of childrenDocuments) {
      await updateChildPaths(childDoc);
    }

    // 문서 삭제
    await documentsColl.deleteOne({ _id: id });

    return { success: true };
  } catch (error) {
    throw error; // 에러를 상위 계층으로 전달
  }
}

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
