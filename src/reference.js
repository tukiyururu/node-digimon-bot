import cheerio from 'cheerio';
import rp from './rp';
const debug = require('debug')('bot:reference');

class Reference {
    constructor() {
        this.dic = null;
    }

    getDic() {
        return rp('http://digimon.net/reference/')
               .then(this.parseHtml)
               .then(objs => this.dic = objs);
    }

    search(ary) {
        const henkan = str => {
            return str.replace(/[ -~｡-ﾟ]/g, s => {
                return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
            });
        };

        const result = this.dic.filter(mon => {
            return (mon.name.indexOf(ary[0])) !== 0 ? false
                 : (ary[1]) ? (mon.name.indexOf(henkan(ary[1])) !== -1)
                 : true;
        });
        debug(result);
        return result;
    }

    parseStr(str) {
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
