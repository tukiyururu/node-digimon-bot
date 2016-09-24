import cheerio from 'cheerio';
import co from 'co';
import client from './client';
import util from './util';
const debug = require('debug')('bot:reference');

class Reference {
    constructor() {
        this.dic = null;
        this.regexp = new RegExp(
            '(.+モン)((?![\\(（:：\\+＋]).*|[\\(（:：\\+＋].+)', 'i'
        );
    }

    getDic() {
        return util.rp('http://digimon.net/reference')
               .then(this.parseHtml)
               .then(objs => this.dic = objs);
    }

    getImg(url) {
        return util.rp(url)
               .then(html => url + cheerio.load(html)('.detail_img img').attr('src'))
               .then(imgUrl => util.rp(imgUrl, { encoding: null }));
    }

    referenceTweet(results) {
        debug(results);

        const self = this;
        return co(function *() {
            for (let result of results) {
                let img = yield self.getImg(result.link);
                let params = {
                    status: `RT ${result.name} - デジモン図鑑 l デジモンオフィシャルポータルサイト デジモンウェブ ${result.link} #${util.random()}`,
                };

                let _status = yield client.upload(img, params)
                      .then(client.update);
                yield util.wait(5000);
            }
        });
    }

    search(word) {
        const ary = this.parseWord(word);
        debug(ary);
        if (!ary) return [];

        return this.dic.filter(mon => {
            return (mon.name.indexOf(ary[1]) !== 0) ? false
                 : (ary[2]) ? (mon.name.indexOf(this.henkan(ary[2])) !== -1)
                 : true;
        });
    }

    henkan(str) {
        return str.replace(/[ -~｡-ﾟ]/g, s =>
            String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
        );
    }

    parseWord(word) {
        const ygg = word.match(/^イグドラシル(_?7D6|＿?７Ｄ６|)$/i);
        if (ygg) return [ygg[0], 'イグドラシル＿７Ｄ６', ''];

        const monW = word.match(/^メタルグレイモン[\(（]?黄[\)）]?$/);
        if (monW) return [monW[0], 'メタルグレイモン（ワクチン種）', ''];

        const monV = word.match(/^メタルグレイモン[\(（]?青[\)）]?$/);
        if (monV) return [monV[0], 'メタルグレイモン（ウィルス種）', ''];

        return word.match(this.regexp);
    }

    parseHtml(html) {
        const $ = cheerio.load(html);

        return $('.fancybox').map((i, el) => {
            let href = $(el).attr('href')
                            .match(/\/cat-digimon-dictionary\/\d{2}-\w?a\/.+\//);

            return {
                name: $(el).text(),
                link: `http://digimon.net${href[0]}`
            };
        }).get();
    }
}

module.exports = new Reference;
