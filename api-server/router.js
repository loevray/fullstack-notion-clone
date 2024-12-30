const router = () => {
  const routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    OPTIONS: {},
  };
  const middlewares = [];

  const executeMiddlewares = (middlewares, req, res, done) => {
    let index = 0;

    const next = (err) => {
      if (err) {
        return done(err);
      }

      if (index >= middlewares.length) {
        return done();
      }

      const middleware = middlewares[index++];
      middleware(req, res, next);
    };

    next();
  };

  return {
    use: (middleware) => {
      middlewares.push(middleware);
      return this;
    },
    post: (path, api) => {
      routes.POST[path] = api;
      return this;
    },
    get: (path, api) => {
      routes.GET[path] = api;
      return this;
    },
    put: (path, api) => {
      routes.PUT[path] = api;
      return this;
    },
    delete: (path, api) => {
      routes.DELETE[path] = api;
      return this;
    },
    options: (path, api) => {
      routes.OPTIONS[path] = api;
      return this;
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

      if (method === "POST" || method === "PUT") {
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
        executeMiddlewares(middlewares, req, res, (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }
          routes[method][url](req, res);
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    },
  };
};

/* 

  router.use(...)사용시 미들웨어 추가
*/

module.exports = router;
