const { createServer } = require("node:http");
const router = require("./router");
const {
  getDocumentListController,
  createDocumentController,
} = require("./documents/documentsController");

const PORT = 4000;

const documentsRouter = router();

documentsRouter.get("/documents", getDocumentListController);
documentsRouter.post("/documents", createDocumentController);

const server = createServer((req, res) => {
  documentsRouter.handleRequest(req, res);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // 서버가 죽지 않도록 기본적인 대응
  // 로그 남기거나 복구 로직 추가 가능
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
