const express = require("express");
const PORT = 5001;
const app = express();

const Users = [
  {
    id: 0,
    name: "Karina",
  },
  {
    id: 1,
    name: "Winter",
  },
];

app.use((req, res, next) => {
  const entryTime = Date.now();
  console.log(`start: ${req.method} ${req.url}`);
  //next()를 호출해서 원래 실행되던 함수를 실행하게 한다.

  next();

  const diffTime = Date.now() - entryTime;
  console.log(`end: ${req.method} ${req.url} ${diffTime}ms`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
