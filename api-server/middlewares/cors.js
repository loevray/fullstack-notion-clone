const CORS_HEADER = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const cors = (req, res, next) => {
  for (const key in CORS_HEADER) {
    res.setHeader(key, CORS_HEADER[key]);
  }
  next();
};

module.exports = cors;
