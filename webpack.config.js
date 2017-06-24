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
const publicPath = isProduction ? '/' : 'http://localhost:8080/'
const htmlMinifyOptions = {
  removeEmptyAttributes: isProduction,
  removeTagWhitespace: isProduction,
  collapseWhitespace: isProduction,
  inject: 'body'
}

const sassProduction = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    `css-loader?${qs.stringify({
      minimize: true
    })}`,
    'resolve-url-loader',
    `sass-loader`
  ]
})

const sassDeveloper = ['style-loader', 'css-loader', 'sass-loader?sourceMap']

const sassConfiguration = isProduction ? sassProduction : sassDeveloper
/* User Configuration  */
const configuration = {
  localhost: 'http://localhost',
  port: 3000, // this is browserSync Port
  name: isProduction ? '[name].[hash]' : '[name]',
  appName: 'Aspisec',
  appTitle: 'Aspisec — Cybersecurity tailored company',
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
    publicPath: publicPath
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
        use: sassConfiguration
      },
      {
        test: /\.pug$/,
        exclude: ['/node_modules/'],
        use: ['html-loader', `pug-html-loader?${qs.stringify({
          options: {
            debug: !isProduction,
            pretty: true,
            data: {
              title: 'hello',
              home: require('./src/content/home.json')
            }
          }
        })}`]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /src\/assets\/fonts/,
        use: [
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
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    hot: true,
    open: false
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: configuration.faviconPath,
      prefix: './images/favicons-[hash]/',
      background: '#fff',
      title: configuration.appName,
      inject: isProduction,
      emitStats: isProduction,
      statsFilename: 'iconstats-[hash].json',
      icons: {
        android: isProduction,
        appleIcon: isProduction,
        appleStartup: isProduction,
        coast: false,
        favicons: isProduction,
        firefox: isProduction,
        opengraph: isProduction,
        twitter: isProduction,
        yandex: isProduction,
        windows: isProduction
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
      template: './src/views/index.pug',
      minify: htmlMinifyOptions
    }),
    new BrowserSyncPlugin(
      {
        // browse http://localhost:3000/ during development
        host: configuration.localhost,
        port: configuration.port,
        proxy: 'localhost:8080', // proxy for browsersync
        reload: false
      }
    ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

module.exports = webpackConfig
