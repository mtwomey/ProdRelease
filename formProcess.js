const https = require('https');
const URL = require('url');
const util = require('./util.js');
const fs = require('fs');

let prodReleaseFormResponse;

exports.handler = function (event, context) {
    console.log(`Received: ${JSON.stringify(event)}`);

    let prodReleaseFormResponse = fs.readFileSync('prodReleaseFormResponse.json').toString();

	const data = event.payload.submission;
    data.submitter = event.payload.user.name;

    Object.keys(data).forEach(item => {
        prodReleaseFormResponse = prodReleaseFormResponse.replace('${' + item + '}', data[item]);
    });

    util.postHTTPS(event.payload.response_url, JSON.parse(prodReleaseFormResponse)).then(res => {
        context.succeed();
    });
};
