const CustomError = require("../../../customErrors/customError");

const handleErrors = (err) => {
  console.log(err);
  if (err instanceof CustomError)
    return { status: err.status, message: err.message };

  return { status: 500, message: err.message || "Internal Server Error" };
};

module.exports = handleErrors;
