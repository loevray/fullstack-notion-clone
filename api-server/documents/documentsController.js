const {
  createDocument,
  getDocumentById,
  getDocuments,
} = require("./documentsService");

async function getDocumentController(req, res) {
  //req.url에서 documentId를 추출;
  const documentId = req.url.split("/")[2];
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
  return;
}

async function deleteDocumentController(req, res) {
  return;
}

module.exports = {
  getDocumentController,
  getDocumentListController,
  createDocumentController,
  updateDocumentController,
  deleteDocumentController,
};
