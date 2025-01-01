class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.stack = new Error().stack;
    this.status = 404;
  }
}

module.exports = NotFoundError;
