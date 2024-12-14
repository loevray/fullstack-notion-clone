const http = require("http");

const PORT = 4000;

const server = http.createServer();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
