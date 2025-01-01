const handleErrors = require("./customErrors/handleErrors");
const {
  createDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
  deleteDocument,
} = require("./documentsService");

async function getDocumentController(req, res) {
  const documentId = req.params.id;
  let httpStatus = 200;
  let result;

  try {
    result = await getDocumentById(documentId);
  } catch (e) {
    const { status, message } = handleErrors(e);
    result = { message };
    httpStatus = status;
  }

  res.writeHead(httpStatus);
  return res.end(JSON.stringify(result));
}

async function getDocumentListController(req, res) {
  let httpStatus = 200;
  let result;

  try {
    result = await getDocuments();
  } catch (e) {
    const { status, message } = handleErrors(e);
    result = { message };
    httpStatus = status;
  }

  res.writeHead(httpStatus);
  return res.end(JSON.stringify(result));
}

async function createDocumentController(req, res) {
  const { parent, title } = req.body;

  let httpStatus = 201; // Created
  let result;

  try {
    result = await createDocument({ parentId: parent, title });
  } catch (e) {
    const { status, message } = handleErrors(e);
    result = { message };
    httpStatus = status;
  }

  res.writeHead(httpStatus);
  return res.end(JSON.stringify(result));
}

async function updateDocumentController(req, res) {
  const { title, content } = req.body;
  const documentId = req.params.id;

  let httpStatus = 200;
  let result;

  try {
    result = await updateDocument({
      documentId,
      newDocument: { title, content },
    });
  } catch (e) {
    const { status, message } = handleErrors(e);
    result = { message };
    httpStatus = status;
  }

  res.writeHead(httpStatus);
  return res.end(JSON.stringify(result));
}

async function deleteDocumentController(req, res) {
  const documentId = req.params.id;
  let httpStatus = 204; // No Content
  let result;

  try {
    await deleteDocument(documentId);
  } catch (e) {
    const { status, message } = handleErrors(e);
    httpStatus = status;
    result = { message };
  }

  res.writeHead(httpStatus);
  return res.end(JSON.stringify(result));
}

module.exports = {
  getDocumentController,
  getDocumentListController,
  createDocumentController,
  updateDocumentController,
  deleteDocumentController,
};
