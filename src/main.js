import client from './client';
import Reference from './reference';
import wait from './wait';
const debug = require("debug")("bot:stream");

module.exports = function() {
    const ref = new Reference();
    ref.getDic().then(() => {
        const repReg = new RegExp(`^@${process.env.SCREEN_NAME}(.*)`, 'i');

        client.stream(stream => {
            stream.on('data', status => {
                if (!status.text || status.retweeted_status) return;
                debug(`@${status.user.screen_name}: ${status.text}`);

                let reply = status.text.match(repReg);
                debug(reply);
                if (!reply) return;

                let digimonsResult = ref.search(reply[1]);
                if (!digimonsResult) return;

                digimonsResult.map(result => {
                    return `RT ${result.name} - デジモン図鑑 l デジモンオフィシャルポータルサイト デジモンウェブ ${result.link}`;
                })
                .reduce((current, args) => {
                    return current.then(() => {
                        return client.update({ status: `${args} #${Math.random().toString(36).slice(-8)}`})
                               .then(() => wait(5000));
                    });
                }, Promise.resolve());
            });

            stream.on('error', err => {
                throw err;
            });
        });
    }).catch(err => console.log(err));
};
