import cheerio from 'cheerio';
import rp from './rp';
const debug = require('debug')('bot:reference');

class Reference {
    constructor() {
        this.dic = null;
        this.regexp = new RegExp(
            '(.+モン)((?![\\(（\\:：\\+＋]).*|[\\(（\\:：\\+＋].+)', 'i'
        );
    }

    getDic() {
        return rp('http://digimon.net/reference/')
               .then(this.parseHtml)
               .then(objs => this.dic = objs);
    }

    search(word) {
        let result = [];
        const ary = word.replace(/[\s　]/g, '').match(this.regexp);
        debug(ary);

        if (ary) {
            result = this.dic.filter(mon => {
                return (mon.name.indexOf(ary[1])) !== 0 ? false
                     : (ary[2]) ? (mon.name.indexOf(this.henkan(ary[2])) !== -1)
                     : true;
            });
        }
        debug(result);
        return result;
    }

    henkan(str) {
        return str.replace(/[ -~｡-ﾟ]/g, s => {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }

    parseHtml(html) {
        const $ = cheerio.load(html);

        return $('.fancybox').map((i, el) => {
            let name = $(el).text();
            if (name.indexOf('イグドラシル') !== -1) return;
            let href = $(el).attr('href')
                            .match(/\/cat-digimon-dictionary\/\d{2}-\w?a\/(.+)\//);

            return {
                name: name,
                en: href[1],
                link: `http://digimon.net${href[0]}`,
                img: `http://digimon.net${href[0]}img-digmon.jpg`,
            };
        }).get();
    }
}

export default Reference;
