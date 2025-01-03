describe("handleErrors", () => {
  const handleErrors = require("./handleErrors");
  const CustomError = require("../customErrors/customError");

  it("should return status and message when error is instance of CustomError", () => {
    const err = new CustomError(404, "Not Found");
    const result = handleErrors(err);

    expect(result).toEqual({ status: 404, message: "Not Found" });
  });

  it("should return status and message when error is not instance of CustomError", () => {
    const err = new Error("Internal Server Error");
    const result = handleErrors(err);

    expect(result).toEqual({ status: 500, message: "Internal Server Error" });
  });
});
