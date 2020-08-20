const webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var path = require("path");
module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./web/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.yaml$/i,
        use: "raw-loader",
      },

      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "validator.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "Validator",
    libraryExport: "default",
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "web/index.html" }),
    new webpack.EnvironmentPlugin({
      API_URL:
        process.env.NODE_ENV == "production"
          ? "/validate-xml"
          : "http://localhost:8095",
    }),
  ],
};
