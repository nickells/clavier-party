const path = require('path');

const config = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    modules: ['node_modules'],
  },
  module: {
    rules: [{
      test: /\.js$/
    }]
  }
}

module.exports = config
