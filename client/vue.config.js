const path = require('path');

module.exports = {
  configureWebpack: {
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery',
    //   }),
    // ],
  },
  outputDir: path.resolve(__dirname, '../public'),
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        // target: 'https://mastermindgeeks.herokuapp.com'
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    publicPath:
      process.env.NODE_ENV === 'production'
        ? '/usmp-seguimiento.github.io/'
        : '/',
  },
};
