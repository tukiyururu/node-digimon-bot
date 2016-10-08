import 'babel-polyfill';
import ref from './reference';
import client from './client';
const debug = require('debug')('bot:stream');

module.exports = function() {
    ref.getDic().then(() => {
        const repReg = new RegExp(`^@${client.screenName}(.*)`, 'i');
        debug(repReg);

        client.stream(stream => {
            stream.on('error', err => {
                throw err;
            });

            stream.on('data', status => {
                if (!status.text || status.retweeted_status) return;
                debug(`@${status.user.screen_name}: ${status.text}`);

                const reply = status.text.match(repReg);
                debug(reply);
                if (!reply) return;

                const _reply = reply[1].replace(/[\s　]/g, '');
                const refResults = ref.search(_reply);
                if (refResults.length > 0) ref.referenceTweet(refResults);
            });
        });
    })
    .catch(err => console.log(err));
};
