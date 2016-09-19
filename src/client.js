import Twitter from 'twitter';
require('dotenv').config({ silent: true });
const debug = require("debug")("bot:client");

const client = new Twitter({
    consumer_key:        process.env.CONSUMER_KEY,
    consumer_secret:     process.env.CONSUMER_SECRET,
    access_token_key:    process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

export default {
    update: params => {
        return new Promise((resolve, reject) => {
            client.post('statuses/update', params, (err, status) => {
                if (err) reject(err);
                debug(`@${status.user.screen_name}: ${status.text}`);
                resolve(status);
            });
        });
    },

    stream: cb => {
        client.stream('statuses/filter', { track: 'javascript' }, cb);
    }
};
