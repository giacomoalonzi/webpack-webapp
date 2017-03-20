const webpack = require('webpack')
const BrowserSyncPlugin = require('browsersync-webpack-plugin')

module.exports = {
  output: {
    pathinfo: true,
    publicPath: 'http://localhost:3000'
  },
  devtool: '#cheap-module-source-map',
  stats: false,
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new BrowserSyncPlugin({
      proxyUrl: 'http://localhost:3000',
      watch: 'src/**/*.js',
      delay: 500
    })
  ]
}
