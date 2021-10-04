module.exports = {
  publicPath: process.env.VUE_APP_BASE_ROUTE || '/',
  // configureWebpack: {
  //   output: {
  //     libraryExport: 'default'
  //   }
  // }
  css: { extract: false },
};
