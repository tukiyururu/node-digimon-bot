const debug = require('debug')('bot:digimon');
import request from 'request';
import cheerio from 'cheerio';

class Reference {
    constructor() {
        this.digs = null;
    }

    getDics() {
        return new Promise((resolve, reject) => {
            request({
                url: 'http://digimon.net/reference/'
            }, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    this.digs = this.parseHtml(body);
                    debug(this.digs.length + ' items.');
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    search(words) {
        const result = [];

        this.digs.forEach(dic => {
            if (dic.name.indexOf(words[0]) !== 0) return;

            if (!words[1]) {
                result.push(dic);
                return;
            }

            let ex = words[1].replace(/[ -~｡-ﾟ]/g, s => {
                return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
            });
            if (dic.name.indexOf(ex) !== -1) result.push(dic);
        });
        debug(result);
        return result;
    }

    parseString(str) {
        const ary = str.match(/(.+?モン)(.*)/i);
        debug(ary ? ary.slice(0, 3) : ary);
        if (!ary) return false;
        return ary.slice(1, 3);
    }

    parseHtml(html) {
        const $ = cheerio.load(html);

        return $('.fancybox').map((i, el) => {
            let name = $(el).text();
            let href = $(el).attr('href')
                            .match(/cat-digimon-dictionary\/\d{2}-\w?a\/(.+?)\//);

            return {
                name: name,
                link: 'http://digimon.net/' + href[0],
                en: href[1]
            };
        }).get();
    }
}

export default Reference;
