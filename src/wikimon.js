import cheerio from "cheerio";
import util from "./util";

class Wikimon {
    async image(url) {
        const data = await util.rp(url);
        const $ = cheerio.load(data);
        const imgUrl = "http://wikimon.net" +
                       $("#StatsBoxMorphContent1 .floatnone img").attr("src");
        const img = await util.rp(imgUrl, { encoding: null });

        return img;
    }

    parse(html) {
        const $ = cheerio.load(html);

        return $(".wikitable tr:nth-child(n+1)").map((i, el) => {
            const td = $(el).find("td:nth-child(-n+2)");
            const name = td.eq(1).text();

            if (name === " N/A ") return;
            const a = td.children("a");
            const link = `http://wikimon.net${a.attr("href")}`;

            return {
                name: name.exclude(),
                img: () => this.image(link),
                tweet: `RT ${a.text()} - Wikimon - The #1 Digimon wiki ${link}`
            };
        }).get();
    }
}

export default new Wikimon();
