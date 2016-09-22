require('dotenv').config({ silent: true });
import request from 'request';
const debug = require('debug')('bot:util');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko';

module.exports = {
    rp: (url, opt) => {
        return new Promise((resolve, reject) => {
            if (!opt) opt = {};
            opt.url = url;
            opt.headers = { 'user-agent': USER_AGENT };

            request(opt, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    debug(url);
                    resolve(body);
                } else {
                    reject(err);
                }
            });
        });
    },

    wait: time => {
        return new Promise(resolve => {
            setTimeout(() => {
                debug(`wait ${time}ms`);
                resolve();
            }, time);
        });
    },

    random: () => Math.random().toString(36).slice(-8)
};
