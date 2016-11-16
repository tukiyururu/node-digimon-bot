import Reference from "./reference";
import Wikimon from "./wikimon";
import util from "./util";

class Search {
    constructor() {
        this.ref  = [];
        this.wiki = [];
    }

    async set() {
        const ref  = await util.rp("http://digimon.net/reference/");
        const wiki = await util.rp("http://wikimon.net/List_of_Digimon");

        this.ref  = Reference.parse(ref);
        this.wiki = Wikimon.parse(wiki);
    }

    get(words) {
        let result = [];
        const text = words[2].zenkaku();

        if (words[1] !== "/w") {
            result = this.search(this.ref, text);
        }
        if (result.isEmpty()) {
            result = this.search(this.wiki, text);
        }
        return (result.isEmpty()) ? null : result[0];
    }

    search(obj, name) {
        return obj.filter((mon) => (mon.name === name));
    }
}

export default new Search();
