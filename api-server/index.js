const http = require("http");
const router = require("./router");
const {
  getDocumentListController,
  createDocumentController,
} = require("./documents/documentsController");

const PORT = 4000;

const documentsRouter = router();

documentsRouter.get("/documents", getDocumentListController);
documentsRouter.post("/documents", createDocumentController);

const server = http.createServer((req, res) => {
  documentsRouter.handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
