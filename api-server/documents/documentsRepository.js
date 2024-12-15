const { connectDB } = require("../models/db");

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

async function getDocuments(query = { parent: null }) {
  const db = await connectDB();

  const pipeline = [
    {
      $match: query,
    },
    {
      $graphLookup: {
        from: "documents", // 같은 컬렉션 내에서 하위 문서를 찾음
        startWith: "$_id", // 현재 문서의 _id부터 시작
        connectFromField: "_id", // 연결할 필드 (현재 문서의 _id)
        connectToField: "parent", // 하위 문서가 연결된 필드 (부모 문서의 _id)
        as: "documents", // 결과를 담을 필드명
      },
    },
  ];

  const result = await db.collection("documents").aggregate(pipeline).toArray();
  return result;
}

async function getDocumentById(id) {
  const db = await connectDB();
  return await db.collection(COLLECTION_NAME).findOne({ _id: id });
}

async function createDocument({ parent = null, document }) {
  const db = await connectDB();

  const nextId = await getNextSequenceValue(COLLECTION_NAME);
  const newDocument = { _id: nextId, id: nextId, ...document };
  return await db.collection(COLLECTION_NAME).insertOne(newDocument);
}

async function updateDocument({ id, newDocument }) {
  const db = await connectDB();

  return await db
    .collection(COLLECTION_NAME)
    .updateOne({ _id: id }, { $set: newDocument });
}

async function deleteDocument(id) {
  const db = await connectDB();

  const session = client.startSession(); // 트랜잭션 시작

  try {
    session.startTransaction(); // 트랜잭션 시작

    // 삭제할 문서 찾기
    const documentToDelete = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: id });
    if (!documentToDelete) {
      throw new Error("Document not found");
    }

    const parentId = documentToDelete.parentId; // 삭제된 문서의 parentId 저장

    // 문서 삭제
    await db.collection(COLLECTION_NAME).deleteOne({ _id: id }, { session });

    // 하위 문서들의 parentId를 삭제된 문서의 parentId로 업데이트
    await db.collection(COLLECTION_NAME).updateMany(
      { parentId: id },
      { $set: { parentId } }, // 하위 문서의 parentId를 삭제된 문서의 parentId로 변경
      { session }
    );

    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    // 트랜잭션 롤백

    await session.abortTransaction();
    throw error; // 에러를 상위 계층으로 전달
  } finally {
    session.endSession(); // 세션 종료
  }
}

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
