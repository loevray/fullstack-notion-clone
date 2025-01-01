const CustomError = require("./customError");

const handleErrors = (err) => {
  if (err instanceof CustomError)
    return { status: err.status, message: err.message };

  return { status: 500, message: "Internal Server Error" };
};

module.exports = handleErrors;
