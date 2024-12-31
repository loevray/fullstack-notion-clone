const { createServer } = require("node:http");
const router = require("./router");
const {
  getDocumentListController,
  createDocumentController,
  getDocumentController,
} = require("./documents/documentsController");
const cors = require("./middlewares/cors");
const bodyParser = require("./middlewares/bodyParser");

const PORT = 4000;

const documentsRouter = router();

documentsRouter.get("/documents", getDocumentListController);
documentsRouter.get("/documents/:id", getDocumentController);
documentsRouter.post("/documents", createDocumentController);

const logMiddleware = (req, res, next) => {
  console.log(`메서드:${req.method}는 링크:${req.url} 접속시 실행됨`);
  next();
};

documentsRouter.use(logMiddleware);
documentsRouter.use(cors);
documentsRouter.use(bodyParser);

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
