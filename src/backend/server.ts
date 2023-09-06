import express from "express";
import webpack from "webpack";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import developmentConfig from "./webpack/webpack.development.js";

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import path from "path";

const app = express();

const BASE_PATH = "";
const buildPath = path.resolve(process.cwd(), "../../app/build");
const PORT = 3000;

app.get(`${BASE_PATH}/internal/isAlive|isReady`, (req, res) =>
  res.sendStatus(200),
);

if (process.env.NODE_ENV === "development") {
  const compiler = webpack(developmentConfig);

  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: developmentConfig.output.publicPath,
  });

  app.use(devMiddleware);
  app.use(webpackHotMiddleware(compiler));
}

app.get("*", (_req, res) => {
  res.sendFile("index.html", { root: buildPath });
});

app.listen(PORT, () => {
  console.log(`Server startet på PORT=${PORT}`);
});
