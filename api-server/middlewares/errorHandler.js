const handleErrors = require("../api/documents/utils/handleErrors");

const errorHandler = (err, req, res, next) => {
  const { status, message } = handleErrors(err);
  res.writeHead(status);
  res.end(JSON.stringify({ message }));
};

module.exports = errorHandler;
