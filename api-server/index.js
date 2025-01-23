const { createServer } = require("node:http");
const cors = require("./middlewares/cors");
const bodyParser = require("./middlewares/bodyParser");
const logMiddleware = require("./middlewares/log");
const errorHandler = require("./middlewares/errorHandler");
const createRouter = require("./router/createRouter");
const DocumentsController = require("./api/documents/controller/documentsController");
const DocumentsService = require("./api/documents/service/documentsService");
const DocumentsRepository = require("./api/documents/repository/documentsRepository");
const connectDB = require("./models/db");

const PORT = 4000;

const router = createRouter();

const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const initServer = async () => {
  try {
    // DB 연결
    const db = await connectDB();
    console.log("Database connected successfully");

    // 종속성 초기화
    const documentsRepository = new DocumentsRepository(db);
    const documentsService = new DocumentsService(documentsRepository);
    const documentsController = new DocumentsController(documentsService);

    const {
      getDocumentController,
      getDocumentListController,
      updateDocumentController,
      deleteDocumentController,
      createDocumentController,
    } = documentsController;

    // 라우터 설정
    const router = createRouter();
    router.get(
      "/documents",
      wrapAsync(getDocumentListController.bind(documentsController))
    );
    router.get(
      "/documents/:id",
      wrapAsync(getDocumentController.bind(documentsController))
    );
    router.put(
      "/documents/:id",
      wrapAsync(updateDocumentController.bind(documentsController))
    );
    router.delete(
      "/documents/:id",
      wrapAsync(deleteDocumentController.bind(documentsController))
    );
    router.post(
      "/documents",
      wrapAsync(createDocumentController.bind(documentsController))
    );

    // 미들웨어 설정
    router.use(logMiddleware);
    router.use(cors);
    router.use(bodyParser);
    router.use(errorHandler);

    // 서버 생성 및 시작
    const server = createServer((req, res) => {
      router.handleRequest(req, res);
    });

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    //서버최종 예외 처리
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
    });
  } catch (error) {
    console.error("Failed to initialize the server:", error);
    process.exit(1);
  }
};

initServer();
