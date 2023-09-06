import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";

import common from "./webpack.common.js";
import HtmlWebpackPlugin from "html-webpack-plugin";

const publicPath = process.env.PUBLIC_PATH || "";

const productionConfig = merge(common, {
  mode: "production",
  entry: "./src/frontend/index.tsx",
  output: {
    filename: "[name].bundle.js",
    path: path.join(process.cwd(), "dist_production"),
    publicPath: publicPath,
    clean: true,
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Tilleggsstønader",
      template: path.join(process.cwd(), "src/frontend/index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
});

export default productionConfig;
