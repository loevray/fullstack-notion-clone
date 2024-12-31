const router = () => {
  const routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    OPTIONS: {},
  };
  const middlewares = [];

  // 미들웨어 실행 함수
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

  // 동적 경로를 처리하기 위한 함수
  const parsePath = (path) => {
    const parts = path.split("/");

    // :id와 같은 동적 경로를 정규식으로 바꿔줍니다.
    return new RegExp(
      "^" +
        parts
          .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
          .join("/") +
        "$"
    );
  };

  // 라우터에 경로를 등록하는 함수
  return {
    use: (middleware) => {
      middlewares.push(middleware);
      return this;
    },
    post: (path, api) => {
      routes.POST[path] = { api, regex: parsePath(path) };
      return this;
    },
    get: (path, api) => {
      routes.GET[path] = { api, regex: parsePath(path) };
      return this;
    },
    put: (path, api) => {
      routes.PUT[path] = { api, regex: parsePath(path) };
      return this;
    },
    delete: (path, api) => {
      routes.DELETE[path] = { api, regex: parsePath(path) };
      return this;
    },
    options: (path, api) => {
      routes.OPTIONS[path] = { api, regex: parsePath(path) };
      return this;
    },
    handleRequest: (req, res) => {
      const { method, url } = req;

      //CORS Preflight request 처리
      if (method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
      }

      let matchedRoute = null;

      if (routes[method]) {
        // 경로에서 동적 부분을 정규식으로 매칭
        matchedRoute = Object.entries(routes[method]).find(
          ([route, { regex }]) => regex.test(url)
        );
      }

      if (matchedRoute) {
        const [route, { api, regex }] = matchedRoute;
        const match = regex.exec(url);
        req.params = {};

        // 정규식에서 추출된 값들을 req.params에 할당
        if (match) {
          const paramNames = route
            .split("/")
            .filter((part) => part.startsWith(":"));
          paramNames.forEach((param, index) => {
            req.params[param.substring(1)] = match[index + 1]; // :id 등
          });
        }

        // 미들웨어 실행
        executeMiddlewares(middlewares, req, res, (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }

          // API 실행
          api(req, res);
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    },
  };
};

module.exports = router;
