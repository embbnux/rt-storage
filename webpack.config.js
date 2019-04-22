const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: 'RTStorage',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  externals: {
    'rxjs': {
      commonjs: 'rxjs',
      commonjs2: 'rxjs',
      amd: 'rxjs',
      root: 'rxjs'
    },
    'localforage': {
      commonjs: 'localforage',
      commonjs2: 'localforage',
      amd: 'localforage',
      root: 'localforage'
    },
    'uuid': {
      commonjs: 'uuid',
      commonjs2: 'uuid',
      amd: 'uuid',
      root: 'uuid'
    }
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
};
