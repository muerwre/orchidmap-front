// import webpack from 'webpack';
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// const FlowWebpackPlugin = require('flow-webpack-plugin');
const { version } = require('./package.json');

const WebpackGitHash = require('webpack-git-hash');
const { join } = require('path');


/* Plugins */

const concatPlugin = new webpack.optimize.ModuleConcatenationPlugin();
const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  title: 'Map',
  hash: false,
  favicon: 'src/sprites/favicon.png',
});

const isDevelopment = process.env.NODE_ENV !== 'production';
const devtool = isDevelopment ? 'cheap-module-eval-source-map' : 'source-map';

// const flowPlugin = new FlowWebpackPlugin();

const gitPlugin = new WebpackGitHash();


/* Resolve */

const resolve = {
  alias: {
    $components: join(__dirname, 'src/components'),
    $containers: join(__dirname, 'src/containers'),
    $constants: join(__dirname, 'src/constants'),
    $sprites: join(__dirname, 'src/sprites'),
    $config: join(__dirname, 'src/config'),
    $styles: join(__dirname, 'src/styles'),
    $redux: join(__dirname, 'src/redux'),
    $utils: join(__dirname, 'src/utils'),
    $modules: join(__dirname, 'src/modules'),
  },

  extensions: ['*', '.js', '.jsx', '.json']
};

/* Configuration */

module.exports = () => {
  /* Export */
  const plugins = [
    // concatPlugin,
    htmlPlugin,
    // flowPlugin,
    gitPlugin,
    new webpack.IgnorePlugin(/^osrm-text-instructions$/, /leaflet-routing-machine$/)
  ];

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        },
        {
          test: /\.less$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'less-loader' }
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2|otf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        },
        {
          test: /\.(png|svg)$/,
          use: {
            loader: 'file-loader',
            options: {}
          }
        }
      ]
    },
    devtool,
    resolve,
    plugins,
    entry: {
      // loader: './src/loader.js',
      app: './src/index.js',
    },
    output: {
      filename: '[name].bundle.[githash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            minSize: 0
          }
        }
      },
      occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
    },
    devServer: {
      historyApiFallback: true,
      port: 8000,
      contentBase: 'dist',
      publicPath: '/',
      hot: true,
    }
  };
};

