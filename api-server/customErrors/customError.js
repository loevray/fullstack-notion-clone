class CustomError extends Error {
  constructor({ message, status }) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.stack = new Error().stack;
  }
}

module.exports = CustomError;
