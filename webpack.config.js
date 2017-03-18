const webpack = require('webpack')
const isProduction = process.argv.indexOf('-p') !== -1
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const minify = require('html-minifier').minify
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const merge = require('webpack-merge')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const qs = require('qs')

const htmlMinifyOptions = {
  removeEmptyAttributes: isProduction,
  removeTagWhitespace: isProduction,
  collapseWhitespace: isProduction
}

/* User Configuration  */
const configuration = {
  localhost: 'http://localhost',
  port: 3000,
  name: isProduction ? '[name].[hash]' : '[name]',
  publicPath: '/',
  appName: 'AppName',
  appTitle: 'Title of your app',
  faviconPath: './src/assets/images/favicon.png'
}

// webpack configuration
let webpackConfig = {
  context: path.resolve(__dirname),
  entry: {
    main: ['./src/assets/scripts/main.js', './src/assets/styles/main.scss']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `scripts/${configuration.name}.js`,
    publicPath: configuration.publicPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // resolve-url-loader may be chained before sass-loader if necessary
          use: [
            // css loader enable css minimize if is production env
            `css-loader?${qs.stringify({
              minimize: isProduction
            })}`,
            'resolve-url-loader',
            // sass loader enable sourceMap if is not production env
            `sass-loader?${qs.stringify({
              sourceMap: !isProduction
            })}`
          ]
        })
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /src\/assets\/fonts/,
        loader: [
          `file-loader?name=images/[name].[ext]`,
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: '75-90',
                speed: 3
              },
              svgo: {
                plugins: [
                  {
                    removeViewBox: true
                  },
                  {
                    cleanupAttrs: true
                  },
                  {
                    removeEmptyAttrs: true
                  }
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff2?|svg)$/,
        exclude: /src\/assets\/images/,
        use: [
          `file-loader?name=fonts/${configuration.name}.[ext]`
        ]
      }
    ]
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: configuration.faviconPath,
      prefix: 'icons-[hash]/',
      background: '#fff',
      title: configuration.appName,
      inject: true,
      emitStats: true,
      statsFilename: 'iconstats-[hash].json',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new ExtractTextPlugin({
      filename: `styles/${configuration.name}.css`,
      loader: 'css-loader?modules-true!postcss-loader!sass-loader',
      disable: !isProduction
    }),
    new UglifyJSPlugin({
      beautify: false,
      compress: isProduction,
      warnings: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['manifest']
    }),
    new HtmlWebpackPlugin({
      title: configuration.appTitle,
      filename: 'index.html',
      template: 'src/index.html',
      minify: htmlMinifyOptions
    }),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: configuration.localhost,
        port: configuration.port,
        server: { baseDir: ['dist'] },
        watch: ['src/*.html', 'src/scripts/*.js']
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: !isProduction
      }
    )
  ]
}

module.exports = webpackConfig
