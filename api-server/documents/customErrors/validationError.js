class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.stack = new Error().stack;
    this.status = 400;
  }
}

module.exports = ValidationError;
