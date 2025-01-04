module.exports = (documents) => {
  if (!documents || documents.length === 0) {
    return [];
  }

  const idToNodeMap = {};
  const rootNodes = [];

  for (const doc of documents) {
    const { _id, content, updatedAt, createdAt, ...rest } = doc;
    idToNodeMap[doc._id] = { ...rest, documents: [] };
  }

  // 2. 부모-자식 관계 설정
  for (const doc of documents) {
    const { _id, materializedPath } = doc;

    if (!materializedPath) {
      // path가 null이면 루트 문서
      rootNodes.push(idToNodeMap[_id]);
    } else {
      // 부모 ID 추출
      const parentIds = materializedPath.split(",").filter(Boolean);
      const parentId = parentIds[parentIds.length - 1];
      if (idToNodeMap[parentId]) {
        idToNodeMap[parentId].documents.push(idToNodeMap[_id]);
      }
    }
  }

  return rootNodes;
};
