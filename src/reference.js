import cheerio from "cheerio";
import rp from "./rp";

class Reference {
    async image(url) {
        const data = await rp(url);
        const $ = cheerio.load(data);
        const imgUrl = url + $(".detail_img img").attr("src");
        const img = await rp(imgUrl, { encoding: null });

        return img;
    }

    parse(html) {
        const $ = cheerio.load(html);

        return $(".fancybox").map((i, el) => {
            const name = $(el).text();
            const href = $(el).attr("href")
                              .match(/\/cat-digimon-dictionary\/\d{2}-\w?a\/.+\//)[0];
            const link = `http://digimon.net${href}`;

            return {
                name: name,
                img: () => this.image(link),
                tweet: `RT ${name} - デジモン図鑑 l デジモンオフィシャルポータルサイト デジモンウェブ ${link}`
            };
        }).get();
    }
}

export default new Reference();
