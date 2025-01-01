class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.stack = new Error().stack;
    this.status = 500;
  }
}

module.exports = DatabaseError;
