const path = require('path');
const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';

IS_DEV
  ? console.log(`Сборка осуществляется в режиме разработки`)
  : console.log(`Сборка осуществляется в режиме релиза`);

const GLOBAL_CSS_REGEXP = /\.global.css$/;

const DEV_PLUGINGS = [
    new CleanWebpackPlugin(),
    new HotModuleReplacementPlugin(),
];

const COMMON_PLUGINGS = [
  new DefinePlugin({
    'process.env.SITE': `'${process.env.SITE}'`,
    'process.env.PORT': `'${process.env.PORT}'`,
  }),
];

const SITE =
  process.env.SITE === 'undefined' || process.env.SITE === undefined
    ? 'localhost'
    : process.env.SITE;

    const PORT =
  process.env.PORT === 'undefined' || process.env.PORT === undefined
    ? 3000
    : process.env.PORT;

function getEntry() {
  return IS_DEV
    ? [
        path.resolve(__dirname, '../src/client/index.jsx'),
        `webpack-hot-middleware/client?path=http://${SITE}:${PORT}/static/__webpack_hmr`,
      ]
    : [path.resolve(__dirname, '../src/client/index.jsx')];
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: getEntry(),
  cache: { type: 'filesystem' },
  output: {
    path: path.resolve(__dirname, '../app/client'),
    filename: 'client.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: { 
      'react-dom': IS_DEV ? '@hot-loader/react-dom' : 'react-dom',
      'Assets': path.resolve(__dirname, '../src/assets'),
      'Store': path.resolve(__dirname, '../src/store'),
      'Shared': path.resolve(__dirname, '../src/shared'),
      'Icons': path.resolve(__dirname, '../src/shared/icons')
    }
  },
  devtool: IS_DEV ? 'eval' : false,
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
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
        exclude: GLOBAL_CSS_REGEXP,
      },
      {
        test: GLOBAL_CSS_REGEXP,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          "sass-loader"
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
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
  plugins: IS_DEV ? DEV_PLUGINGS.concat(COMMON_PLUGINGS) : COMMON_PLUGINGS,
};