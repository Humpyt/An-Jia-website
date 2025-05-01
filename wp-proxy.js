const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const compression = require('compression');

const app = express();
const port = 10000;

// Enable compression for all responses
app.use(compression());

// Enable CORS for all routes
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:51692'],
    credentials: true
}));

// Simple in-memory cache
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

    // Cache middleware for GET requests
    app.use('/wp-json', (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Skip cache if requested
        if (req.query.no_cache === 'true') {
            return next();
        }

        const cacheKey = `${req.method}:${req.originalUrl}`;
        const cachedResponse = responseCache.get(cacheKey);

        if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_DURATION)) {
            // Return cached response
            res.set('X-Cache', 'HIT');
            res.set('Content-Type', 'application/json');
            return res.send(cachedResponse.data);
        }

        // Store the original send method
        const originalSend = res.send;

        // Override the send method to cache the response
        res.send = function(body) {
            // Only cache successful responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                responseCache.set(cacheKey, {
                    timestamp: Date.now(),
                    data: body
                });
            }

            // Call the original send method
            return originalSend.call(this, body);
        };

        next();
    });

    // Create proxy middleware
    const wpProxy = createProxyMiddleware({
        timeout: 30000, // 30 second timeout
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            '^/wp-json': '/wp-json', // keep /wp-json in the path
        },
        onProxyReq: (proxyReq, req, res) => {
            // Only log non-cached requests
            if (!req.headers['x-cache'] || req.headers['x-cache'] !== 'HIT') {
                console.log(`🔄 Request: ${req.method} ${req.path} -> ${targetUrl}${req.path}`);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            // Add cache headers
            proxyRes.headers['Cache-Control'] = 'public, max-age=300'; // 5 minutes

            // Only log non-cached responses
            if (!req.headers['x-cache'] || req.headers['x-cache'] !== 'HIT') {
                console.log(`✨ ${proxyRes.statusCode} ${req.method} ${req.path}`);
            }
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
        res.json({
            status: 'healthy',
            wordPressUrl: targetUrl,
            cacheSize: responseCache.size,
            cacheItems: Array.from(responseCache.keys())
        });
    });

    // Add a cache clear endpoint
    app.get('/clear-cache', (req, res) => {
        const count = responseCache.size;
        responseCache.clear();
        res.json({
            status: 'success',
            message: `Cleared ${count} cached items`
        });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`
🚀 WordPress Proxy Server Running

📡 Proxy URL: http://localhost:${port}
🎯 Target WordPress: ${targetUrl}
🛠️ Health Check: http://localhost:${port}/health
🧹 Clear Cache: http://localhost:${port}/clear-cache

✨ Your Next.js app will now be able to access WordPress without host file configuration!
        `);
    });
}

// Start the proxy server
startProxy().catch(console.error);
