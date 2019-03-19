const https = require('https');
const URL = require('url');
const slackApiKey = 'xoxp-3858018789-14279323285-573997666691-9a2ad008d3968815633187752d0e86c0';


console.log('Loading function');

let prodReleaseForm = {
    trigger_id: '',
    dialog: {
        callback_id: 'ProdReleaseForm',
        title: 'Schedule Prod Release',
        submit_label: 'Request',
        notify_on_cancel: false,
        state: 'Request',
        elements: [
            {
                type: 'text',
                label: 'Title',
                name: 'title'
            },
            {
                type: 'text',
                label: 'Service & Impact Area',
                name: 'service'
            },
            {
                type: 'text',
                label: 'Expected Outcome',
                name: 'outcome'
            },
            {
                type: 'textarea',
                label: 'Work plan',
                name: 'plan'
            },
            {
                type: 'text',
                label: 'Team',
                name: 'team'
            },
            {
                type: 'text',
                label: 'Date and Timing',
                name: 'timing'
            },
            {
                type: 'text',
                label: 'Testing (what will be tested)',
                name: 'testing'
            },
            {
                type: 'textarea',
                label: 'Rollback Plan',
                name: 'rollback'
            }
        ]
    }
};

let response01 = {
    response_type: 'in_channel',
    text: 'It\'s 80 degrees right now.',
    attachments: [
        {
            text: 'Partly cloudy today and tomorrow'
        }
    ]
};

function postHTTPS(url, data, headers) {
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

exports.handler = function (event, context) {
    console.log(`Received: ${JSON.stringify(event)}`);

    // Check if it's the initial command involkation (and send the form if so)
    if (event.hasOwnProperty('command')) {
        prodReleaseForm.trigger_id = event.trigger_id;
        postHTTPS('https://slack.com/api/dialog.open', prodReleaseForm, {'Authorization': `Bearer ${slackApiKey}`}).then(res => {
            context.succeed();
        });
    }

    // Check if it's the form submission
    if (event.hasOwnProperty('payload')) {
        postHTTPS(event.payload.response_url, response01).then(res => {
            context.succeed();
        });
    }


};

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}