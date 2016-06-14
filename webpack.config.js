module.exports = {
  entry: {
    example: [
        'webpack-dev-server/client?http://localhost:8080',
        './src/examples/App.js',
    ]
  },
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
    }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
