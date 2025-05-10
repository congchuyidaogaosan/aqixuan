const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://8.134.184.96:9801',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/' // 保持路径不变
      }
    })
  );
}; 