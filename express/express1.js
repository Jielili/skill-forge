const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 8010; // 自定义端口号

// 将build文件夹作为静态资源的根目录
const buildPath = path.join(__dirname, '../../workspace/rms-front-end/build');
app.use(express.static(buildPath));

// 添加代理配置
const apiProxyTarget = 'https://eicdev.funplus.io'; // 后端接口的URL
app.use('/rms/api', createProxyMiddleware({ target: apiProxyTarget, changeOrigin: true }));


// 对于所有请求，返回index.html文件
app.get('/rms/web/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});