const path = require('path');

module.exports = {
  entry: './src/examples/App.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'src/examples/dist'),
    filename: 'bundle.js',
    publicPath: '/src/examples/dist/'
  },
  devServer: {
    openPage: 'src/examples/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};
