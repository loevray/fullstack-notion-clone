const logMiddleware = (req, res, next) => {
  console.log(`메서드:${req.method}는 링크:${req.url} 접속시 실행됨`);
  next();
};

module.exports = logMiddleware;
