const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        oneOf: [
          /**
           * As noted, some of our application complexities require us to still use
           * `babel-loader` + `ts-loader` in certain situations. This loader will only
           * apply to files that contain a `.babel` suffix.
           *
           * There are no files in this technical test that match this case.
           */
          {
            resource: /\.babel/i,
            use: [
              'babel-loader',
              'ts-loader',
            ],
          },

          {
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  loader: 'ts',
                  target: ['safari11'], // This target cannot be changed.
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: [
      '.ts',
      '.js',
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = config;
