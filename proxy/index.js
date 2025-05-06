const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

// Create Express Server
const app = express();

// Logging
app.use(morgan('dev'));

// Proxy configuration
const API_SERVICE_URL = 'http://localhost:3001';
const UI_SERVICE_URL = 'http://localhost:8081';

// Proxy middleware configuration for API routes
const apiProxy = createProxyMiddleware('/purchase/api', {
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        // Optional: If your API doesn't expect the /purchase prefix
        // '^/purchase/api': '/api', // remove /purchase prefix
    },
    logLevel: 'debug'
});

// Proxy middleware configuration for UI routes (everything else)
const uiProxy = createProxyMiddleware({
    target: UI_SERVICE_URL,
    changeOrigin: true,
    logLevel: 'debug'
});

// Use the API proxy for /purchase/api/* routes
app.use('/purchase/api', apiProxy);

// Use the UI proxy for all other routes
app.use('/', uiProxy);

// Start the Proxy Server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Local CloudFront proxy server started on port ${PORT}`);
    console.log(`Routing /purchase/api/* requests to ${API_SERVICE_URL}`);
    console.log(`Routing all other requests to ${UI_SERVICE_URL}`);
});