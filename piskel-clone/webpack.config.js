const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack'); // to access built-in plugins
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './app.js',
    screens: './src/screens/index.js',
    'landing page': './src/components/landing page/landing.js',
  },
  output: {
    filename: (chunkData) => {
      switch (chunkData.chunk.name) {
        case 'landing page':
          return 'src/components/[name]/[name].js';
        case 'screens':
          return 'src/[name]/[name].js';
        default:
          return '[name].js';
      }
    },
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => `${path.relative(path.dirname(resourcePath), context)}/`
              ,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: './src/components/landing page/landing.html',
      template: './src/components/landing page/landing.html',
      chunks: ['landing page'],
    }),
    new HtmlWebpackPlugin({
      filename: './src/screens/index.html',
      template: './src/screens/index.html',
      chunks: ['screens'],
    }),
    new CopyPlugin([
      {
        from: './src/screens/images',
        to: 'src/screens/images/',
      },
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      moduleFilename: ({ name }) => {
        switch (name) {
          case 'landing page':
            return 'src/components/[name]/[name].css';
          case 'screens':
            return 'src/[name]/[name].css';
          default:
            return '[name].css';
        }
      },
    }),
  ],

};
