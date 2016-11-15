import Reference from "./reference";
import Wikimon from "./wikimon";
import rp from "./rp";

class Search {
    constructor() {
        this.ref  = null;
        this.wiki = null;
    }

    async set() {
        const ref  = await rp("http://digimon.net/reference/");
        const wiki = await rp("http://wikimon.net/List_of_Digimon");

        this.ref  = Reference.parse(ref);
        this.wiki = Wikimon.parse(wiki);
    }

    get(words) {
        let result = [];
        const text = this.zenaku(words[2]);

        if (words[1] !== "/w") {
            result = this.search(this.ref, text);
        }
        if (!result.length) {
            result = this.search(this.wiki, text);
        }
        return (result.length) ? result[0] : null;
    }

    search(obj, name) {
        return obj.filter(mon => (mon.name === name));
    }

    zenaku(str) {
        return str.replace(/[ -~｡-ﾟ]/g, s => {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }
}

export default new Search();
