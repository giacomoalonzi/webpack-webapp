# Simple Webpack Webapp Boilerplate


### Installation

In root folder run `yarn`. All packages will be installed.

### Configuration

In config file, we have a `configuration` object for simple and usefull webapp setup.

```
const configuration = {
  localhost: 'http://localhost',
  port: 3000,
  name: isProduction ? '[name].[hash]' : '[name]',
  appName: 'AppName',
  appTitle: 'Title Of Your App',
  faviconPath: './src/assets/images/favicon.png'
}
```

### Watch and Build

Run `yarn start` for developer mode.

Run `yarn build` to build your app for distribution.

### Multi Html Files

If you need multi html file (eg. index.html, about.html, portfolio.html) you have to add some new lines into `webpack.config.js`

In plugins section after
```
new HtmlWebpackPlugin({
  title: configuration.appTitle,
  filename: 'index.html',
  template: 'src/index.html',
  minify: htmlMinifyOptions
}),
```
add

```
new HtmlWebpackPlugin({
  title: configuration.appTitle,
  filename: 'htmlFileName.html',
  template: 'src/htmlFileName.html',
  minify: htmlMinifyOptions
}),
```
