var webpack = require("webpack");

module.exports = {
  cache: true,
  context: __dirname + "/src",
  entry: "./app.js",
  output: {
    path: "./dist",
    publicPath: "/dist/",
    filename: "config-form.js",
    library: "WebvisualConfigForm",
    libraryTarget: "umd"
  },
  plugins: [
    new ExtractTextPlugin("styles.css", {allChunks: true}),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  devtool: "source-map",
  externals: {
    react: {
      root: "React",
      commonjs: "react",
      commonjs2: "react",
      amd: "react"
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"],
      }
    ]
  }
};
