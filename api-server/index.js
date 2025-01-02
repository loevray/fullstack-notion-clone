const { createServer } = require("node:http");
const router = require("./router");
const {
  getDocumentListController,
  createDocumentController,
  getDocumentController,
  updateDocumentController,
  deleteDocumentController,
} = require("./documents/documentsController");
const cors = require("./middlewares/cors");
const bodyParser = require("./middlewares/bodyParser");
const handleErrors = require("./documents/customErrors/handleErrors");

const PORT = 4000;

const documentsRouter = router();

const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

documentsRouter.get("/documents", wrapAsync(getDocumentListController));
documentsRouter.get("/documents/:id", wrapAsync(getDocumentController));
documentsRouter.put("/documents/:id", wrapAsync(updateDocumentController));
documentsRouter.delete("/documents/:id", wrapAsync(deleteDocumentController));
documentsRouter.post("/documents", wrapAsync(createDocumentController));

const logMiddleware = (req, res, next) => {
  console.log(`메서드:${req.method}는 링크:${req.url} 접속시 실행됨`);
  next();
};

const errorHandler = (err, req, res, next) => {
  const { status, message } = handleErrors(err);
  res.writeHead(status);
  res.end(JSON.stringify({ message }));
};

documentsRouter.use(logMiddleware);
documentsRouter.use(cors);
documentsRouter.use(bodyParser);
documentsRouter.use(errorHandler);

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
