module.exports = (documents) => {
  const idToNodeMap = {}; // 문서를 ID 기반으로 빠르게 조회하기 위한 맵
  const rootNodes = []; // 최상위 문서를 저장

  // 1. 맵에 저장하면서 path를 제거한 기본 구조 초기화
  for (const doc of documents) {
    const { _id, content, updatedAt, createdAt, ...rest } = doc; // path 제거
    idToNodeMap[doc._id] = { ...rest, documents: [] };
  }

  // 2. 부모-자식 관계 설정
  for (const doc of documents) {
    const { _id, path } = doc;

    if (!path) {
      // path가 null이면 루트 문서
      rootNodes.push(idToNodeMap[_id]);
    } else {
      // 부모 ID 추출
      const parentIds = path.split(",").filter(Boolean);
      const parentId = parentIds[parentIds.length - 1];
      if (idToNodeMap[parentId]) {
        idToNodeMap[parentId].documents.push(idToNodeMap[_id]);
      }
    }
  }

  return rootNodes;
};
