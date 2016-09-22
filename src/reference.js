import cheerio from 'cheerio';
import { rp } from './util';
const debug = require('debug')('bot:reference');

class Reference {
    constructor() {
        this.dic = null;
        this.regexp = new RegExp(
            '(.+モン)((?![\\(（:：\\+＋]).*|[\\(（:：\\+＋].+)', 'i'
        );
    }

    getDic() {
        return rp('http://digimon.net/reference')
               .then(this.parseHtml)
               .then(objs => this.dic = objs);
    }

    search(word) {
        let results = [];
        const ary = this.parseWord(word);
        debug(ary);

        if (ary) {
            results = this.dic.filter(mon => {
                return (mon.name.indexOf(ary[1]) !== 0) ? false
                     : (ary[2]) ? (mon.name.indexOf(this.henkan(ary[2])) !== -1)
                     : true;
            });
        }
        debug(results);
        return results;
    }

    henkan(str) {
        return str.replace(/[ -~｡-ﾟ]/g, s =>
            String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
        );
    }

    parseWord(word) {
        return word.match(/^イグドラシル(_?7D6|＿?７Ｄ６|)$/i) ?
            ['イグドラシル＿７Ｄ６', 'イグドラシル＿７Ｄ６', '']

        : word.match(/^メタルグレイモン[\(（]?黄[\)）]?$/) ?
            ['メタルグレイモン（ワクチン種）', 'メタルグレイモン（ワクチン種）', '（ワクチン種）']

        : word.match(/^メタルグレイモン[\(（]?青[\)）]?$/) ?
            ['メタルグレイモン（ウィルス種）', 'メタルグレイモン（ウィルス種）', '（ウィルス種）']

        : word.match(this.regexp);
    }

    parseHtml(html) {
        const $ = cheerio.load(html);

        return $('.fancybox').map((i, el) => {
            let href = $(el).attr('href')
                            .match(/\/cat-digimon-dictionary\/\d{2}-\w?a\/(.+)\//);

            return {
                name: $(el).text(),
                en:    href[1],
                link: `http://digimon.net${href[0]}`,
                img:  `http://digimon.net${href[0]}img-digmon.jpg`
            };
        }).get();
    }
}

module.exports = new Reference;
