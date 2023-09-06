import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";

import common from "../../../webpack/webpack.common.js";
import HtmlWebpackPlugin from "html-webpack-plugin";

const publicPath = process.env.PUBLIC_URL || "/";

const developmentConfig = merge(common, {
  mode: "development",
  entry: {
    tilleggsstønaderSakFrontend: [
      "webpack-hot-middleware/client",
      "../../src/frontend/index.tsx",
    ],
  },
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.join(process.cwd(), "dist_development"),
    publicPath: publicPath,
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Tilleggsstønader",
      template: path.join(process.cwd(), "../../src/frontend/index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
});

export default developmentConfig;
