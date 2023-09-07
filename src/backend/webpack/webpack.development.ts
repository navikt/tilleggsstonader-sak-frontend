import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { miljø } from "../miljø";

const publicPath = process.env.PUBLIC_URL || "/";

const developmentConfig = {
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
    path: path.join(process.cwd(), miljø.builldPath),
    publicPath: publicPath,
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          compilerOptions: {
            noEmit: false,
          },
          onlyCompileBundledFiles: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [["@babel/preset-env"], ["@babel/preset-react"]],
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Tilleggsstønader",
      template: path.join(process.cwd(), "../../src/frontend/index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.PUBLIC_URL": JSON.stringify(publicPath),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default developmentConfig;
