const https = require('https');
const URL = require('url');
const util = require('./util.js');
const fs = require('fs');

const slackApiKey = process.env.SLACK_API_KEY;

let prodReleaseForm = JSON.parse(fs.readFileSync('prodReleaseForm.json').toString());

exports.handler = function (event, context) {
    console.log(`Received: ${JSON.stringify(event)}`);
    prodReleaseForm.trigger_id = event.trigger_id;
    util.postHTTPS('https://slack.com/api/dialog.open', prodReleaseForm, {'Authorization': `Bearer ${slackApiKey}`}).then(res => {
        context.succeed();
    });
};