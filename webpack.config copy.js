const path = require('path');

module.exports = {
  entry: './index.js',
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.MINIFY_ENABLED === '1' ? 'index.min.js' : 'index.js',
    library: {
      name: 'format',
      type: 'commonjs',
    },
  },
  optimization: {
    minimize: process.env.MINIFY_ENABLED === '1'
  }
}
