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
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    }]
  },
  node: {
    fs: "empty",
    tls: "empty"
  }
}

module.exports = config;
