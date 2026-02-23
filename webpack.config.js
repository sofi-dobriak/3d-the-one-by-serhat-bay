const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  // mode: 'production',
  mode: 'development',
  entry: {
    index: './src/assets/s3d/scripts/index-app.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: 'auto',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          // Keep async-only deps (e.g. AFRAME) out of the initial vendors bundle.
          chunks: 'initial',
        },
      },
    },
  },
  plugins: process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : [],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
};

module.exports = config;
