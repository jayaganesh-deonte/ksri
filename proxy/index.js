const https = require('https');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

// Create Express App
const app = express();

// Logging
app.use(morgan('dev'));

// // SSL Certificates
// const sslOptions = {
//     key: fs.readFileSync('./ssl/key.pem'),
//     cert: fs.readFileSync('./ssl/cert.pem')
// };

// Proxy Configuration
const API_SERVICE_URL = 'http://localhost:3002';
const UI_SERVICE_URL = 'http://localhost:8081';

// API Proxy
app.use('/purchase/api', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    logLevel: 'debug'
}));

// UI Proxy
app.use('/', createProxyMiddleware({
    target: UI_SERVICE_URL,
    changeOrigin: true,
    logLevel: 'debug'
}));

// Start HTTPS Server
const PORT = 8080;
const HOST = 'localhost';
// https.createServer(sslOptions, app).listen(PORT, 'www.localhost', () => {
//     console.log(`HTTPS proxy server running at ${HOST}:${PORT}`);
// });

app.listen(PORT, 'localhost', () => {
    console.log(`HTTPS proxy server running at ${HOST}:${PORT}`);
});
