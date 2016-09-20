const debug = require('debug')('bot:wait');

module.exports = function(m) {
    return new Promise(resolve => {
        setTimeout(() => {
            debug(`wait ${n}ms`);
            resolve();
        }, n);
    });
};
