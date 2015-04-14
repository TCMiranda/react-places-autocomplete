var webpack = require('webpack')
  , path = require('path');

// Simple dev / production switch
function _env(dev, production) {
  return process.env.BUILD_ENV === 'production' ? production : dev;
}

function _path(p) {
  return path.join(__dirname, p);
}

var compiler = module.exports = {
  devtool: _env('eval', false),
  entry: _path('src/index.js'),
  output: {
    path: _path('lib'),
    filename: 'index.js',
    library: 'gmaps-places-autocomplete',
    libraryTarget: "commonjs2"
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, loader: 'babel?stage=0&optional=runtime' },
    ]
  },
  externals: {
    react: 'React',
    google: 'google'
  },
  resolve: {
    extensions: ['', '.react.js', '.js', '.jsx']
  }
};
