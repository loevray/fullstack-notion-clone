const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    req.url === "/" ? "/public/index.html" : req.url
  );

  const extname = path.extname(filePath);

  // MIME 타입 설정
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
  };

  const contentType = mimeTypes[extname] || "text/plain";

  // 파일 읽기
  fs.readFile(filePath, (err, data) => {
    if (!err) {
      //오류가 아닐시, 파일 반환
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
      return;
    }

    if (err.code === "ENOENT") {
      // html 요청이면 index.html 반환 (SPA 새로고침 대응)
      fs.readFile(
        path.join(__dirname, "/public/index.html"),
        (error, indexData) => {
          if (error) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(indexData);
        }
      );
      return;
    }

    // 기타 서버 오류
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
