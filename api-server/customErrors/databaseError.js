const CustomError = require("./customError");

class DatabaseError extends CustomError {
  constructor({ message, status = 500 }) {
    super({ message, status });
  }
}

module.exports = DatabaseError;
