'use strict';

import webpack from 'webpack';
import fs from 'fs';
import path from 'path';
import meta from './meta.json';

const publicPath = '/assets/@vtex.' + meta.name + '/';
const production = process.env.NODE_ENV === 'production';

// Generate an entry point for each component in 'src/components/'
const publicComponents = fs.readdirSync('src/components');
let entryPoints = publicComponents.reduce((entryPoints, entryPoint) => {
  return {
    ...entryPoints,
    [entryPoint]: [`./src/components/${entryPoint}/index.js`]
  };
}, entryPoints);

// Create a commons.js for the public components
const commonsPublicOptions = {
  name: 'commons',
  chunks: publicComponents
};

// Generate an entry point for each editor component
const editorComponents = fs.readdirSync('src/editors');
entryPoints = editorComponents.reduce((entryPoints, entryPoint) => {
  return {
    ...entryPoints,
    [`editors/${entryPoint}`]: [`./src/editors/${entryPoint}/index.js`]
  };
}, entryPoints);

// Create a commons.js for the public components
const commonsEditorOptions = {
  name: 'editors/commons',
  chunks: editorComponents
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
    new webpack.optimize.CommonsChunkPlugin(commonsEditorOptions)
  ] : [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin(commonsPublicOptions),
    new webpack.optimize.CommonsChunkPlugin(commonsEditorOptions)
  ],

  externals: {
    'alt': 'alt',
    'axios': 'axios',
    'immutable': 'Immutable',
    'intl': 'Intl',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-intl': 'ReactIntl',
    'react-router': 'ReactRouter',
    'sdk': 'storefront.sdk',
    'vtex-editor': 'vtex.editor'
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'assets': path.join(__dirname, '/src/assets'),
      'editors': path.join(__dirname, '/src/editors'),
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
    jsonpFunction: 'webpackJsonp_' + meta.vendor.replace(/\-/g, '') + '_' + meta.name.replace(/\-/g, ''),
    devtoolModuleFilenameTemplate: 'webpack:///' + meta.name + '/[resource]'
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
