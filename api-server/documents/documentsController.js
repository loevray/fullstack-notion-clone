const {
  createDocument,
  getDocumentById,
  getDocuments,
} = require("./documentsRepository");

async function getDocumentController(req, res) {
  const { documentId } = req.body;
  const document = await getDocumentById(documentId);
  return res.status(200).json(document);
}
async function getDocumentListController(req, res) {
  const documentList = await getDocuments();
  return res.status(200).json(documentList);
}
async function createDocumentController(req, res) {
  const { parentId, document } = req.body;
  const newDocument = await createDocument({ parentId, document });
  return res.status(201).json(newDocument);
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
