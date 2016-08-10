var path = require("path");
var cssnext = require('postcss-cssnext');

module.exports = {
  devtool: 'inline-source-map',

  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loaders: ["style", "css?modules&localIdentName=[name]__[hash:base64:5]", "postcss", "stylus"]
      },
      {
        test: /\.css$/,
        loader: "style!css?localIdentName=[name]__[hash:base64:5]"
      },
      {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
      },
      {
        test: /\.json$/,
        include: path.join(__dirname, 'node_modules', 'pixi.js'),
        loader: 'json',
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
          name: '[name]_[hash]',
          prefixize: true,
          // spriteModule: 'utils/my-custom-sprite'
        })
      },
      { test: /\.woff$/, loader: 'file?mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.woff2$/, loader: 'file?mimetype=application/font-woff2&name=fonts/[name].[ext]' },
      { test: /\.[ot]tf$/, loader: 'file?mimetype=application/octet-stream&name=fonts/[name].[ext]' }
    ]
  },
  node: {
    fs: 'empty'
  },

  stylus: {
    import: [path.resolve(__dirname, "src/static/styles/vars.styl")],
  },

  postcss: [
    cssnext({
      browsers: ['last 10 versions', 'IE > 8'],
    })
  ],

  // plugins: [
  //   process.env.new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false, drop_console: true}}),
  // ],

  devServer: {
    publicPath: "/dist/",
  }
};
