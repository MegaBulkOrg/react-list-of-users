const path = require('path');
const nodeExternals = require('webpack-node-externals');

const IS_DEV = process.env.NODE_ENV === 'development';
const GLOBAL_CSS_REGEXP = /\.global.css$/;
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  cache: { type: 'filesystem' },
  entry: path.resolve(__dirname, '../src/server/server.js'),
  output: {
    path: path.resolve(__dirname, '../app/server'),
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'Assets': path.resolve(__dirname, '../src/assets'),
      'Store': path.resolve(__dirname, '../src/store'),
      'Shared': path.resolve(__dirname, '../src/shared'),
      'Icons': path.resolve(__dirname, '../src/shared/icons')
    } 
  },
  module: {
    rules: [      
      {
        test: /\.[jt]sx?$/,
        use: ['ts-loader'],
      },
      {
				test: /\.xml$/i,
				use: ['xml-loader']
			},
			{
				test: /\.csv$/i,
				use: ['csv-loader']
			},
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
                exportOnlyLocals: true
              }
            }
          }
        ],
        exclude: GLOBAL_CSS_REGEXP,
      },
      {
        test: GLOBAL_CSS_REGEXP,
        use: ['css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
                exportOnlyLocals: true
              }
            }
          },
          "sass-loader"
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
                exportOnlyLocals: true
              }
            }
          },
          "less-loader"
        ],
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)/,
        use: ['file-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  devtool: IS_DEV ? 'eval' : false,
  plugins: [
    new DefinePlugin({
      'process.env.SITE': `'${process.env.SITE}'`,
      'process.env.PORT': `'${process.env.PORT}'`,
      'process.env.PORT_HMR': `'${process.env.PORT_HMR}'`
    })
  ]
};