var webpack = require('webpack');
var path = require('path');
var pkg = require('./package.json');
var meta = require('./meta.json');
var publicPath = '/assets/@' + meta.vendor + '.' + pkg.name + '/';
var production = process.env.NODE_ENV === 'production';
var hot = process.env.NODE_ENV === 'hot';
var svgoConfig = JSON.stringify({
  plugins: [
    {removeTitle: true},
    {convertColors: {shorthex: false}},
    {convertPathData: false}
  ]
});

var hotEntryPoints = {
  'HomePage':
    [
      'webpack-dev-server/client?http://127.0.0.1:3000',
      'webpack/hot/only-dev-server',
      './src/pages/HomePage/index.js'
    ],
  'editors/index':
    [
      'webpack/hot/only-dev-server',
      './src/editors/index.js'
    ]
};

var coldEntryPoints = {
  'HomePage': './src/pages/HomePage/index.js',
  'editors/index': './src/editors/index.js'
};

module.exports = {
  devtool: 'sourcemap',

  watch: production ? false : true,

  entry: hot ? hotEntryPoints : coldEntryPoints,

  externals: {
    'sdk': 'storefront.sdk',
    'react': 'React',
    'react-router': 'ReactRouter',
    'lodash': 'lodash',
    intl: 'Intl',
    'react-intl': 'ReactIntl'
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'assets': path.join(__dirname, '/src/assets'),
      'components': path.join(__dirname, '/src/components'),
      'editors': path.join(__dirname, '/src/editors'),
      'pages': path.join(__dirname, '/src/pages'),
      'utils': path.join(__dirname, '/src/utils')
    }
  },

  output: {
    path: path.resolve(__dirname, './storefront/assets/'),
    publicPath: publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    jsonpFunction: 'webpackJsonp_' + meta.vendor.replace(/\-/g, '') + '_' + meta.name.replace(/\-/g, ''),
    devtoolModuleFilenameTemplate: 'webpack:///' + pkg.name + '/[resource]?[hash][id]'
  },

  eslint: {
    configFile: '.eslintrc'
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: hot ? ['react-hot', 'babel-loader?stage=0'] : ['babel-loader?stage=0']
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.svg$/,
        loaders: ['raw-loader', 'svgo-loader?' + svgoConfig]
      }, {
        test: /\.(png|jpg|woff|ttf|eot|woff2)$/,
        loader: 'url-loader?limit=100000'
      }, {
        test: /\.jpg$/,
        loader: 'file-loader'
      }
    ]
  },

  plugins: production ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ] : hot ? [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ] : [
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ],

  quiet: false,

  noInfo: false,

  devServer: {
    publicPath: publicPath,
    port: 3000,
    hot: true,
    inline: true,
    stats: {
      assets: false,
      colors: true,
      version: true,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false
    },
    historyApiFallback: true,
    proxy: {
      '*': 'http://janus-edge.vtex.com.br/'
    }
  }
};
