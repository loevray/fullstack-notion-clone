const http = require("http");

const router = () => {
  const routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    OPTIONS: {},
  };

  return {
    post: (path, api) => {
      routes.POST[path] = api;
    },
    get: (path, api) => {
      routes.GET[path] = api;
    },
    put: (path, api) => {
      routes.PUT[path] = api;
    },
    delete: (path, api) => {
      routes.DELETE[path] = api;
    },
    options: (path, api) => {
      routes.OPTIONS[path] = api;
    },
    handleRequest: (req, res) => {
      const { method, url } = req;
      if (method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
      }

      const route = routes[method][url];

      if (route) {
        route(req, res); // 경로에 해당하는 핸들러 실행
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    },
  };
};

module.exports = router;
