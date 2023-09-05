import express from "express";

const app = express();

const BASE_PATH = "";
const PORT = 3000;

app.get(`${BASE_PATH}/internal/isAlive|isReady`, (req, res) =>
  res.sendStatus(200),
);

app.listen(PORT, () => {
  console.log(`Server startet på PORT=${PORT}`);
});
