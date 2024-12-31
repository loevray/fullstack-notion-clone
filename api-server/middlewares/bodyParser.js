const bodyParser = async (req, res, next) => {
  const method = req.method;
  if (method !== "POST" && method !== "PUT") return next();

  let body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  await new Promise((resolve, reject) => {
    req.on("end", () => {
      try {
        const buffer = Buffer.concat(body);
        req.body = JSON.parse(buffer.toString());
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });

  next();
};

module.exports = bodyParser;
