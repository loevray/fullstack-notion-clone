describe("get todady!", () => {
  it("should return today like YYYY-MM-DD-HH:MM:SS", () => {
    const getToday = require("./getToday");
    const today = getToday();
    const regex = /^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}:\d{2}$/;

    expect(today).toMatch(regex);
  });
});
