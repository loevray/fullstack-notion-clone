const normalizeDocumentsById = (documents, parentDocumentId = null) => {
  const normalizedData = {};

  const normalize = (document, parentId = null) => {
    const { id, title, documents, createAt, updatedAt } = document;
    const normalizedDocument = {
      id,
      title,
      parentDocumentId: parentId,
      childDocumentId: [],
      updatedAt,
      createAt,
    };
    if (documents.length) {
      documents.forEach((childDocument) => {
        normalizedDocument.childDocumentId.push(childDocument.id);
        return normalize(childDocument, id);
      });
    }
    normalizedData[id] = normalizedDocument;
  };

  documents.forEach((document) => normalize(document, parentDocumentId));

  return normalizedData;
};
