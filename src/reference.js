import cheerio from "cheerio";
import util from "./util";

class Reference {
    async image(url) {
        const data = await util.rp(url);
        const $ = cheerio.load(data);
        const imgUrl = url + $(".detail_img img").attr("src");
        const img = await util.rp(imgUrl, { encoding: null });

        return img;
    }

    parse(html) {
        const $ = cheerio.load(html);

        return $(".fancybox").map((i, el) => {
            const name = $(el).text().exclude();
            const href = $(el).attr("href").replace(/\.\.|index\.html/g, "");
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
