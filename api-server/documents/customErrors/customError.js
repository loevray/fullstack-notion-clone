class CustomError extends Error {
  constructor({ message, statusCode }) {
    super({ message });
    this.status = statusCode;
    this.name = this.constructor.name;
    this.stack = new Error().stack;
  }
}

module.exports = CustomError;
