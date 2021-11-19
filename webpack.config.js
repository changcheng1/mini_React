/*
 * @Author: changcheng
 * @Date: 2021-11-19 17:23:39
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  module: {
    rules: [{ test: /\.(j|t)sx?$/i, use: "babel-loader" }],
  },
  devtool: "eval-source-map",
  devServer: {
    // 公共资源路径
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 2000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, "./public/favicon.ico"),
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
  },
};
