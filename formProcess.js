const https = require('https');
const URL = require('url');
const util = require('./util.js');
const fs = require('fs');

let prodReleaseFormResponse;

exports.handler = function (event, context) {
    console.log(`Received: ${JSON.stringify(event)}`);

    prodReleaseFormResponse = fs.readFileSync('prodReleaseFormResponse.json').toString();

	const data = event.payload.submission;

    updateText('title', data.title);
    updateText('service', data.service);
    updateText('outcome', data.outcome);
    updateText('plan', data.plan);
    updateText('team', data.team);
    updateText('timing', data.timing);
    updateText('testing', data.testing);
    updateText('rollback', data.rollback);

    util.postHTTPS(event.payload.response_url, JSON.parse(prodReleaseFormResponse)).then(res => {
        context.succeed();
    });
};

function updateText(blockId, text) {
	prodReleaseFormResponse = prodReleaseFormResponse.replace('${' + blockId + '}', text);
}