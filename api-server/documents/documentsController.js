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

  console.log(JSON.stringify(result));

  res.writeHead(httpStatus);
  return res.end(JSON.stringify(result));
}

async function getDocumentListController(req, res) {
  const document = await getDocuments();
  res.writeHead(200);
  return res.end(JSON.stringify(result));
}

async function createDocumentController(req, res) {
  const { parent } = req.body;

  const createdDocument = await createDocument({ parentId: +parent });

  res.writeHead(201);
  return res.end(JSON.stringify(createdDocument));
}

async function updateDocumentController(req, res) {
  const { title, content } = req.body;
  const documentId = req.params.id;

  const updatedDocument = await updateDocument({
    documentId,
    newDocument: { title, content },
  });

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
