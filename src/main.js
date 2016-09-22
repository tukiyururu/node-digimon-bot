require('dotenv').config({ silent: true });
import 'babel-polyfill';
import googl from 'goo.gl';
import co from 'co';
import ref from './reference';
import client from './client';
import util from './util';
const debug = require('debug')('bot:stream');

module.exports = function() {
    ref.getDic().then(() => {
        googl.setKey(process.env.GOOGL_API);
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
                if (!refResults) return;

                co(function *() {
                    for (let result of refResults) {
                        let img = yield util.rp(result.img, { encoding: null });
                        let url = yield googl.shorten(result.link);
                        let media_ids = yield client.upload(img);
                        let params = {
                            status: `RT ${result.name} - デジモン図鑑 l デジモンオフィシャルポータルサイト デジモンウェブ ${url} #${util.random()}`,
                            media_ids: media_ids
                        };

                        yield client.update(params);
                        yield util.wait(5000);
                    }
                });
            });
        });
    })
    .catch(err => console.log(err));
};
