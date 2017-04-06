module.exports = {
  entry: './src/examples/App.js',
  output: {
    path: './src/examples/dist',
    filename: './src/examples/dist/bundle.js'
  },
  module: {
    loaders: [
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
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  }
};
