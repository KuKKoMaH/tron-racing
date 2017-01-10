const path = require("path");
const webpack = require("webpack");
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  devtool: process.env.NODE_ENV == 'production' ? null : 'inline-source-map',

  entry:  "./src/index.js",
  output: {
    path:       path.resolve(__dirname, "dist"),
    publicPath: "",
    filename:   "bundle.js"
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.styl', '.css']
  },

  module: {
    rules: [
      {
        test: /\.styl$/,
        use:  [
          "style-loader",
          {
            loader:  "css-loader",
            options: {
              modules:        true,
              localIdentName: '[local]__[hash:base64:5]',
            }
          },
          "postcss-loader",
          {
            loader:  "stylus-loader",
            options: {
              import: [path.resolve(__dirname, "src/static/styles/vars.styl")],
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use:  ["style", "css?localIdentName=[local]__[hash:base64:5]"]
      },
      {
        test:   /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test:    /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader:  'babel-loader',
      },
      {
        test:    /\.svg$/,
        use: [
          {
            loader:  'svg-sprite-loader?' + JSON.stringify({
              name:      '[name]_[hash]',
              prefixize: true,
            })
          }
        ]
      },
      {test: /\.woff$/, loader: 'file-loader?mimetype=application/font-woff&name=fonts/[name].[ext]'},
      {test: /\.woff2$/, loader: 'file-loader?mimetype=application/font-woff2&name=fonts/[name].[ext]'},
      {test: /\.[ot]tf$/, loader: 'file-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]'},
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js'),
        loader:  'transform-loader/cacheable?brfs'
      },
    ],
  },
  node:   {
    fs: 'empty'
  },

  plugins: [
    new CheckerPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // })
    // process.env.new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false, drop_console: true}}),
  ],

  devServer: {
    publicPath: "/dist/",
  }
};
