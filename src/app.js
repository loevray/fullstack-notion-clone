const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
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
      // 파일을 찾을 수 없음
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
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

//-------db------//
