process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const path = require('path');
const paths = require('react-scripts/config/paths');
const webpack = require('webpack');
const config = require('react-scripts/config/webpack.config.dev.js');

var entry = config.entry;
var plugins = config.plugins;

entry = entry.filter(fileName => !fileName.match(/webpackHotDevClient/));
plugins = plugins.filter(plugin => !(plugin instanceof webpack.HotModuleReplacementPlugin));

config.entry = entry;
config.plugins = plugins;

const configChrome = {
  context: path.resolve(__dirname, '../chrome'),
  entry: {
    content: './content.js',
    background: './background.js',
  },
  output: {
    path: paths.appBuild,
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['env'],
        plugins: [require('babel-plugin-transform-object-rest-spread')]
      },
    },
    ]
  }
}

webpack([configChrome, config]).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder();
  }
  console.error(stats.toString({
    chunks: false,
    colors: true
  }));
});

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
  fs.copySync(path.join(__dirname, '../chrome/manifest.json'), paths.appBuild + '/manifest.json', { overwrite: true });
}