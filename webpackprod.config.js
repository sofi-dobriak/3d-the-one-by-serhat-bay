const TerserPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'production',
  entry: {
    index: './src/assets/s3d/scripts/index-app.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: 'auto',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
          output: {
            comments: false, // Remove comments
            beautify: false, // Minify code
          },
        },
      }),
    ],
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
