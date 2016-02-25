module.exports = {
  devtool: "eval-source-map",

  entry: {
    app: __dirname + "/client/index.js"
  },

  output: {
    path: __dirname + "/server/static",
    filename: "[name].js"
  },

  module: {
    loaders: [
      { test:/\.js$/, loaders:["babel-loader"] }
    ]
  }
}
