const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const minify = require('html-minifier').minify;
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

/* Configuration */
const isProduction = process.env.NODE_ENV == 'production' ? false : true
const configuration = {
  localhost: 'http://localhost',
  port: 3000,
  name: process.env.NODE_ENV == 'production' ? '[name].[hash]' : '[name]',
  publicPath: 'dist',
  sourceMap: process.env.NODE_ENV == 'production' ? null : 'sourceMap',
}

const webpackConfig = {
  entry: {
    main: ['./src/assets/scripts/main.js', './src/assets/styles/main.scss'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `scripts/${configuration.name}.js`,
    publicPath: ''
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [`css-loader?options=minimize:${isProduction}`,'resolve-url-loader', `sass-loader?${configuration.sourceMap}`],
        })
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /src\/assets\/fonts/,
        use: [
          `file-loader?name=images/${configuration.name}.[ext]`,
          {
            loader: 'image-webpack-loader',
            query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            pngquant: {
              quality: '75-90',
              speed: 3,
            },
            svgo:{
              plugins: [
                {
                  removeViewBox: false
                },
                {
                  removeEmptyAttrs: false
                }
              ]
            }
          },
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff2?|svg)$/,
        use: [
          `file-loader?name=fonts/${configuration.name}.[ext]`,
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: `/styles/${configuration.name}.css`,
      loader: 'css-loader?modules-true!postcss-loader!sass-loader',
      disable: process.env.NODE_ENV === 'production'
    }),
    new UglifyJSPlugin({
      beautify: false,
      compress: isProduction,
      warnings: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeEmptyAttributes: isProduction,
        removeTagWhitespace: isProduction,
        collapseWhitespace: isProduction,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: configuration.localhost,
        port: configuration.port,
        server: { baseDir: [configuration.publicPath] },
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: true
      }
    )
  ]
}
module.exports = webpackConfig
