module.exports = {
  getToday: () => {
    const now = new Date();

    return (formattedDate = now
      .toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replaceAll(" ", "")
      .replaceAll(".", "-"));
  },
};
