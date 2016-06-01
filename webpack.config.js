var debug = (process.env.NODE_ENV !== "production");
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/ava.js',
  output: {
    path: __dirname,
    filename: debug ? 'ava.js' : 'ava.min.js',
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: false,
      sourcemap: false
    }),
  ],
};