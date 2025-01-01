const CustomError = require("./customError");

class NotFoundError extends CustomError {
  constructor({ message, status = 404 }) {
    super({ message, status });
  }
}

module.exports = NotFoundError;
