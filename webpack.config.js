// import webpack from 'webpack';
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// const FlowWebpackPlugin = require('flow-webpack-plugin');
// const { version } = require('./package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const WebpackGitHash = require('webpack-git-hash');
const { join } = require('path');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/* Plugins */

// const concatPlugin = new webpack.optimize.ModuleConcatenationPlugin();
const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  title: 'Map',
  hash: false,
  favicon: 'src/sprites/favicon.png',
});

const miniCssExractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css'
});

const isDevelopment = process.env.NODE_ENV !== 'production';
const devtool = isDevelopment ? 'cheap-module-eval-source-map' : 'source-map';

// const flowPlugin = new FlowWebpackPlugin();

// const gitPlugin = new WebpackGitHash();


/* Resolve */

const resolve = {
  alias: {
    $components: join(__dirname, 'src/components'),
    $containers: join(__dirname, 'src/containers'),
    $constants: join(__dirname, 'src/constants'),
    $sprites: join(__dirname, 'src/sprites'),
    $config: join(__dirname, './config'),
    $styles: join(__dirname, 'src/styles'),
    $redux: join(__dirname, 'src/redux'),
    $utils: join(__dirname, 'src/utils'),
    $modules: join(__dirname, 'src/modules'),
  },
  extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json']
};

/* Configuration */

module.exports = () => {
  /* Export */
  const plugins = [
    // concatPlugin,
    htmlPlugin,
    // flowPlugin,
    // gitPlugin,
    new webpack.IgnorePlugin(/^osrm-text-instructions$/, /leaflet-routing-machine$/),
    miniCssExractPlugin,
    new webpack.HashedModuleIdsPlugin(),
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
            { loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader },
            // { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'less-loader' }
          ]
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        { test: /\.(ts|tsx)?$/, loader: 'awesome-typescript-loader' },
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
      app: './src/index.tsx',
    },
    output: {
      publicPath: '/',
      filename: isDevelopment ? '[name].[hash].js' : '[name].[contenthash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          // vendor chunk (uncomment if you want all node_modules to be in vendor.js bundle
          leaflet: {
            name: 'leaflet',
            chunks: 'all',
            test: /node_modules\/leaflet/,
            priority: 21,
          },
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          }
        }
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
    },
    devServer: {
      historyApiFallback: true,
      port: 8000,
      // host: '192.168.88.40',
      contentBase: 'dist',
      publicPath: '/',
      hot: true,
    }
  };
};

