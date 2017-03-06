const path = require('path');

const config = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      { test: /\.(js|html)$/ }
    ]
  }
}

module.exports = config;
