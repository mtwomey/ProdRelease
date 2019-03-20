const https = require('https');
const URL = require('url');

exports.postHTTPS = function (url, data, headers) {
    return new Promise((resolve, reject) => {
        const targetUrl = URL.parse(url);
        const postData = JSON.stringify(data);
        const requestHeaders = { // Default headers
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify(data).length
        };
        Object.assign(requestHeaders, headers);
        const identifier = randomString(5);
        const req = https.request({
            host: targetUrl.hostname,
            path: targetUrl.pathname,
            method: 'POST',
            headers: requestHeaders
        }, (res) => {
            console.log(`[${identifier}] Status Code: ${res.statusCode}`);
            console.log(`[${identifier}] Status Message: ${res.statusMessage}`);
            res.on('data', (d) => {
                console.log(`[${identifier}] Post Response: ${d}`);
                resolve();
            });

        });
        console.log(`[${identifier}] Posting to: ${url}`);
        console.log(`[${identifier}] Data: ${postData}`);
        req.write(postData);
        req.end();
    });
}

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}