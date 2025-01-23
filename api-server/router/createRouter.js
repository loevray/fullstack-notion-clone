const createRouter = () => {
  const routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    OPTIONS: {},
  };
  const middlewares = [];
  const errorMiddlewares = [];

  const defaultErrorHandler = (err, req, res) => {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  };

  // 미들웨어 실행 함수
  const executeRouteHandlers = (middlewares, req, res, api) => {
    let middlewareIndex = 0;
    let errorMiddlewareIndex = 0;

    const next = (err) => {
      if (err) {
        const errorMiddleware = errorMiddlewares[errorMiddlewareIndex++];

        if (!errorMiddleware) {
          return defaultErrorHandler(err, req, res);
        }

        return errorMiddleware(err, req, res, next);
      }

      if (middlewareIndex >= middlewares.length) {
        return api(req, res, next);
      }

      const middleware = middlewares[middlewareIndex++];
      middleware(req, res, next);
    };

    next();
  };

  // 동적 경로를 처리하기 위한 함수
  const parsePath = (path) => {
    const parts = path.split("/");

    // :id와 같은 동적 경로가 있으면 [^/]+을 더한 정규식으로 변경
    const regexParts = parts
      .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
      .join("/");

    return new RegExp(`^${regexParts}$`);
  };

  // 동적 경로에서 추출한 params를 반환하는 함수
  const getParams = (route, match) => {
    let params = {};
    const paramNames = route.split("/").filter((part) => part.startsWith(":"));

    paramNames.forEach((param, index) => {
      params[param.substring(1)] = match[index + 1]; // :id 등
    });

    return params;
  };

  // 라우터에 경로를 등록하는 함수
  return {
    use: (middleware) => {
      if (middleware.length === 3) {
        middlewares.push(middleware);
      }
      if (middleware.length === 4) {
        errorMiddlewares.push(middleware);
      }
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
        matchedRoute = Object.entries(routes[method]).find(([_, { regex }]) =>
          regex.test(url)
        );
      }

      if (!matchedRoute) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Not Found");
      }

      const [route, { api, regex }] = matchedRoute;
      const match = regex.exec(url);

      req.params = {};

      // 정규식에서 추출된 값들을 req.params에 할당
      if (match) {
        req.params = getParams(route, match);
      }

      // 미들웨어 실행
      executeRouteHandlers(middlewares, req, res, api);
    },
  };
};

module.exports = createRouter;
