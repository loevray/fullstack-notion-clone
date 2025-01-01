const CustomError = require("./customError");

class ValidationError extends CustomError {
  constructor({ message, status = 400 }) {
    super({ message, status });
  }
}

module.exports = ValidationError;
