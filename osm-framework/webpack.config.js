// ./webpack.config.js
const path = require("path");
module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "bundle.js", // all js files are bundled into this single file
    path: path.resolve(__dirname, "out"),
  },
  devtool: "source-map",
  devServer: {
    static: "./out",
    port: 9000, //default port: 8080
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // TypeScript loader
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
