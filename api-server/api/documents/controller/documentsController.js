class DocumentsController {
  constructor(service) {
    this.service = service;
  }

  async getDocumentController(req, res) {
    const documentId = req.params.id;
    const document = await this.service.getDocumentById(documentId);

    res.writeHead(200);
    return res.end(JSON.stringify(document));
  }

  async getDocumentListController(req, res) {
    const documentList = await this.service.getDocuments();
    res.writeHead(200);
    return res.end(JSON.stringify(documentList));
  }

  async createDocumentController(req, res) {
    const { parent, title } = req.body;

    const createdDocument = await this.service.createDocument({
      title,
      parentId: +parent,
    });
    res.writeHead(201);
    return res.end(JSON.stringify(createdDocument));
  }

  async updateDocumentController(req, res) {
    const { title, content } = req.body;
    const documentId = req.params.id;

    const updatedDocument = await this.service.updateDocument({
      documentId,
      newDocument: { title, content },
    });

    res.writeHead(200);
    return res.end(JSON.stringify(updatedDocument));
  }

  async deleteDocumentController(req, res) {
    const documentId = req.params.id;
    await this.service.deleteDocument(documentId);

    res.writeHead(204);
    return res.end();
  }
}

module.exports = DocumentsController;
