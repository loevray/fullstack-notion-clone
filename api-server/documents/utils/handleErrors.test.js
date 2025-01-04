const DatabaseError = require("../../customErrors/databaseError");
const NotFoundError = require("../../customErrors/notFoundError");
const ValidationError = require("../../customErrors/validationError");

describe("handleErrors", () => {
  const handleErrors = require("./handleErrors");
  const CustomError = require("../../customErrors/customError");

  it("should return status and message when error is instance of CustomError", () => {
    const err = new CustomError({ status: 401, message: "Custom Error" });
    const result = handleErrors(err);

    expect(result).toEqual({ status: 401, message: "Custom Error" });
  });

  it("should return status and message when error is instance of extended CustomError", () => {
    const err = new NotFoundError({ message: "NotFoundError" });
    const result = handleErrors(err);

    expect(result).toEqual({ status: 404, message: "NotFoundError" });
  });

  it("should return status and message when error is instance of extended CustomError", () => {
    const err = new ValidationError({ message: "Validation Error" });
    const result = handleErrors(err);

    expect(result).toEqual({ status: 400, message: "Validation Error" });
  });

  it("should return status and message when error is instance of extended CustomError", () => {
    const err = new DatabaseError({ message: "Database Error" });
    const result = handleErrors(err);

    expect(result).toEqual({ status: 500, message: "Database Error" });
  });

  it("should return status and message when error is not instance of CustomError", () => {
    const err = new Error("Internal Server Error");
    const result = handleErrors(err);

    expect(result).toEqual({ status: 500, message: "Internal Server Error" });
  });
});
