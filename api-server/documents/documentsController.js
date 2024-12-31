const {
  createDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
  deleteDocument,
} = require("./documentsService");
const getToday = require("./utils/getToday");

async function getDocumentController(req, res) {
  const documentId = req.params.id;
  const document = await getDocumentById(documentId);
  res.writeHead(200);
  return res.end(JSON.stringify(document));
}

async function getDocumentListController(req, res) {
  const documentList = await getDocuments();
  res.writeHead(200);
  return res.end(JSON.stringify(documentList));
}

async function createDocumentController(req, res) {
  const { parent, title } = req.body;
  const newDocument = await createDocument({ parentId: parent, title });
  res.writeHead(201);
  return res.end(JSON.stringify(newDocument));
}

async function updateDocumentController(req, res) {
  const { title, content } = req.body;
  const documentId = req.params.id;
  const updatedDocument = await updateDocument({
    documentId,
    newDocument: { title, content },
  });

  console.log(updatedDocument);
  res.writeHead(200);
  return res.end(JSON.stringify(updatedDocument));
}

async function deleteDocumentController(req, res) {
  const documentId = req.params.id;
  await deleteDocument(documentId);
  res.writeHead(204);
  return res.end(JSON.stringify(documentId));
}

module.exports = {
  getDocumentController,
  getDocumentListController,
  createDocumentController,
  updateDocumentController,
  deleteDocumentController,
};
