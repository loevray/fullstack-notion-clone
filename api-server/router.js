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
    handleRequest: async (req, res) => {
      const { method, url } = req;

      // CORS 처리
      if (method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
      }

      if (method === "POST") {
        let body = [];

        req.on("data", (chunk) => {
          body.push(chunk);
        });

        await new Promise((resolve, reject) => {
          req.on("end", () => {
            try {
              const buffer = Buffer.concat(body);
              req.body = JSON.parse(buffer.toString());
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      if (routes[method] && routes[method][url]) {
        routes[method][url](req, res);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    },
  };
};

module.exports = router;
