import request from 'request';
const debug = require('debug')('bot:net');

module.exports = function(url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
                'referer': 'http://digimon.net/'
            }
        }, (err, res, body) => {
            if (err) reject(err);
            if (res.statusCode === 200) {
                debug(url);
                resolve(body);
            }
        });
    });
};
