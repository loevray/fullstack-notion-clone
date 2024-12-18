const {
  createDocument,
  getDocumentById,
  getDocuments,
} = require("./documentsRepository");

async function getDocumentController(req, res) {
  const { documentId } = req.body;
  const document = await getDocumentById(documentId);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  return res.end(JSON.stringify(document));
}
async function getDocumentListController(req, res) {
  const documentList = await getDocuments();
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  return res.end(JSON.stringify(documentList));
}
async function createDocumentController(req, res) {
  const { parent: parentId, title } = req.body;
  const newDocument = await createDocument({ parentId, title });
  res.writeHead(201, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
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
