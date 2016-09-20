import client from './client';
import Reference from './reference';
const debug = require("debug")("bot:stream");

module.exports = function() {
    const ref = new Reference();
    ref.getDic().then(() => {
        const repReg = new RegExp(`^@${process.env.SCREEN_NAME}(.*)`, 'i');

        client.stream(stream => {
            stream.on('data', status => {
                if (!status.text || status.retweeted_status) return;
                debug(`@${status.user.screen_name}: ${status.text}`);

                let reply = '@botyururu メタルグレイモン'.match(repReg);
                debug(reply);
                if (!reply) return;
                let digimonsResult = ref.search(reply[1]);
                if (digimonsResult) {

                }
            });

            stream.on('error', err => {
                throw err;
            });
        });
    });
};
