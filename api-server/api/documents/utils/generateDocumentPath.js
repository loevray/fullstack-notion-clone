function generateDocumentPath({ parentId, currentPath, parentPath }) {
  //루트에 문서를 생성하는 경우
  if (!parentId) return null;

  //자식으로 문서를 생성하는 경우
  if (!currentPath) {
    //부모가 루트문서라면
    if (!parentPath) return `,${parentId},`;

    return `${parentPath}${parentId},`;
  }

  //조상문서 삭제후 자식문서들의 경로를 업데이트
  let newPath = currentPath.replace(`,${parentId},`, ",");
  return newPath === "," ? null : newPath;
}

module.exports = generateDocumentPath;
