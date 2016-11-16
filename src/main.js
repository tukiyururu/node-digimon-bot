import "babel-polyfill";
import Search from "./search";
import client from "./client";

(async () => {
    await Search.set();
    const reg = new RegExp(`^@${client.name}[\\s　](\/w|)[\\s　]{0,1}(.+)`, "i");

    client.stream((tweet) => {
        const reply = tweet.match(reg);

        if (reply) {
            const digimon = Search.get(reply);

            if (digimon) {
                (async () => {
                    const data = await digimon.img();
                    await client.update({ status: digimon.tweet }, data);
                })()
                .catch(console.log);
            }
        }
    });
})()
.catch(console.log);
