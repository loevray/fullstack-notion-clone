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

const logMiddleware = (req, res, next) => {
  console.log(`메서드:${req.method}는 링크:${req.url} 접속시 실행됨`);
  next();
};

const CORS_HEADER = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const setHeader = (req, res, next) => {
  for (const key in CORS_HEADER) {
    res.setHeader(key, CORS_HEADER[key]);
  }
  next();
};

documentsRouter.use(logMiddleware);
documentsRouter.use(setHeader);

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
