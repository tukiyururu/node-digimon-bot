require('dotenv').config({ silent: true });
import Twitter from 'twitter';
const debug = require('debug')('bot:client');

const client = new Twitter({
    consumer_key:        process.env.CONSUMER_KEY,
    consumer_secret:     process.env.CONSUMER_SECRET,
    access_token_key:    process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

export default {
    screenName: process.env.SCREEN_NAME,

    update: params => {
        return new Promise((resolve, reject) => {
            client.post('statuses/update', params, (err, tweet) => {
                if (err) reject(err);
                debug(params);
                resolve(tweet);
            });
        });
    },

    upload: data => {
        return new Promise((resolve, reject) => {
            client.post('media/upload', { media: data }, (err, media) => {
                if (err) reject(err);
                debug(media);
                resolve(media.media_id_string);
            });
        });
    },

    stream: cb => client.stream('user', cb)
};
