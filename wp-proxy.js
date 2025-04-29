const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 10000;

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:51692'],
    credentials: true
}));

// Detect WordPress URL
async function detectWordPressUrl() {
    const possibleUrls = [
        'http://anjia-wordpress.local',  // Primary domain from hosts file
        'http://www.anjia-wordpress.local',  // WWW subdomain from hosts file
        'http://localhost:10001',  // Common Local by Flywheel port
        'http://localhost:10002',
        'http://localhost:10003'
    ];

    for (const url of possibleUrls) {
        try {
            const response = await fetch(`${url}/wp-json`);
            if (response.ok) {
                console.log(`✅ Found WordPress installation at: ${url}`);
                return url;
            }
        } catch (error) {
            console.log(`❌ No WordPress found at: ${url}`);
        }
    }
    
    console.log('⚠️ Could not auto-detect WordPress URL');
    return 'http://anjia-wordpress.local'; // fallback to default
}

async function startProxy() {
    const targetUrl = await detectWordPressUrl();
    
    // Test WordPress endpoints
    async function testEndpoints() {
        const endpoints = [
            '/wp-json',
            '/wp-json/wp/v2/types',
            '/wp-json/wp/v2/property',
            '/wp-json/wp/v2/posts'
        ];

        console.log('\n🔍 Testing WordPress endpoints...');
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${targetUrl}${endpoint}`);
                const status = response.ok ? '✅' : '❌';
                console.log(`${status} ${endpoint} - Status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (endpoint === '/wp-json/wp/v2/types') {
                        console.log('Available post types:', Object.keys(data));
                    }
                }
            } catch (error) {
                console.log(`❌ ${endpoint} - Error:`, error.message);
            }
        }
        console.log('\n');
    }

    // Run endpoint tests
    await testEndpoints();

    // Create proxy middleware
    const wpProxy = createProxyMiddleware({
        timeout: 30000, // 30 second timeout
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            '^/wp-json': '/wp-json', // keep /wp-json in the path
        },
        onProxyReq: (proxyReq, req, res) => {
            // Log proxy requests with headers
            console.log(`🔄 Request: ${req.method} ${req.path} -> ${targetUrl}${req.path}`);
            console.log('Request Headers:', req.headers);
        },
        onProxyRes: (proxyRes, req, res) => {
            // Log proxy responses
            console.log(`✨ ${proxyRes.statusCode} ${req.method} ${req.path}`);
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.writeHead(500, {
                'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ 
                error: 'Proxy Error',
                message: err.message,
                code: 'PROXY_ERROR'
            }));
        },
    });

    // Use the proxy middleware for all /wp-json routes
    app.use('/wp-json', wpProxy);

    // Add a health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'healthy', wordPressUrl: targetUrl });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`
🚀 WordPress Proxy Server Running

📡 Proxy URL: http://localhost:${port}
🎯 Target WordPress: ${targetUrl}
🛠️ Health Check: http://localhost:${port}/health

✨ Your Next.js app will now be able to access WordPress without host file configuration!
        `);
    });
}

// Start the proxy server
startProxy().catch(console.error);
