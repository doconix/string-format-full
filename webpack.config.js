const path = require('path');

const fnMin = process.env.MINIFY_ENABLED === '1' ? '.min' : ''
const fnIE = process.env.BABEL_ENV === 'legacy' ? '.ie11' : ''
const filename = `index${fnIE}${fnMin}.js`

module.exports = {
  entry: './index.js',
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: filename,
    library: {
      name: 'format',
      type: 'umd',
      export: 'default',
    },
  },
  optimization: {
    minimize: process.env.MINIFY_ENABLED === '1'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}
