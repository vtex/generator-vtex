'use strict';

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const manifest = require('./manifest.json');

var publicPath = '/assets/'+ manifest.vendor + '/' + manifest.name + '/' + manifest.version + '/';
const production = process.env.NODE_ENV === 'production';

// Generate an entry point for each component in 'src/components/'
const publicComponents = fs.readdirSync('src/components');
const entryPoints = publicComponents.reduce((entryPoints, entryPoint) => {
  entryPoints[entryPoint] = [`./src/components/${entryPoint}/index.js`];
  return entryPoints;
}, {});

// Create a common.js for the public components
const commonsPublicOptions = {
  name: 'common',
  chunks: publicComponents
};

let config = {
  entry: entryPoints,

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        loader: 'babel',
        query: {
          stage: 0,
          plugins: []
        }
      }, {
        test: /\.less$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 version', 'less']
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 version', 'sass']
      }, {
        test: /\.css$/,
        loader: ['style', 'css']
      }, {
        test: /\.svg$/,
        loaders: ['raw-loader', 'svgo-loader?' + JSON.stringify({
          plugins: [
            {removeTitle: true},
            {convertColors: {shorthex: false}},
            {convertPathData: false}
          ]
        })]
      }, {
        test: /\.(woff|ttf|eot|woff2)$/,
        loader: 'url-loader?limit=100000'
      }, {
        test: /\.(jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },

  plugins: production ? [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin(commonsPublicOptions),
  ] : [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin(commonsPublicOptions),
  ],

  externals: {
    'alt': 'alt',
    'axios': 'axios',
    'immutable': 'Immutable',
    'intl': 'Intl',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-intl': 'ReactIntl',
    'sdk': 'storefront.sdk',
    'vtex-editor': 'vtex.editor'
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'assets': path.join(__dirname, '/src/assets'),
      'components': path.join(__dirname, '/src/components'),
      'commons': path.join(__dirname, '/src/commons'),
      'utils': path.join(__dirname, '/src/utils')
    }
  },

  output: {
    path: path.resolve(__dirname, './storefront/assets/'),
    publicPath: publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    jsonpFunction: 'webpackJsonp_' + manifest.vendor.replace(/\-/g, '') + '_' + manifest.name.replace(/\-/g, ''),
    devtoolModuleFilenameTemplate: 'webpack:///' + manifest.name + '/[resource]'
  },

  eslint: {
    configFile: '.eslintrc'
  },

  devtool: 'source-map',

  watch: production ? false : true,

  quiet: true,

  noInfo: true,

  proxy: {
    '*': 'http://janus-edge.vtex.com.br/'
  }
};

if (process.env.HOT) {
  config.devtool = 'source-map';
  for (let entryName in config.entry) {
    config.entry[entryName].unshift('webpack-hot-middleware/client');
  }
  config.plugins.unshift(new webpack.NoErrorsPlugin());
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

  config.module.loaders[0].query.plugins.push('react-transform');
  config.module.loaders[0].query.extra = {
    'react-transform': {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      }, {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      }]
    }
  };
}

module.exports = config;
