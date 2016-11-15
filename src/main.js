import "babel-polyfill";
import Search from "./search";
import client from "./client";

(async () => {
    await Search.set();
    const reg = new RegExp(`^@${client.name}[\\s　](\/w|)(?:[\\s　]){0,1}([^\\s　]+)`, "i");

    client.stream(status => {
        if (!status.text || status.retweeted_status) return;
        const reply = status.text.match(reg);

        if (!reply) return;
        const digimon = Search.get(reply);

        if(!digimon) return;
        (async () => {
            const data = await digimon.img();
            await client.update({ status: digimon.tweet }, data);
            await client.wait();
        })()
        .catch(console.log);
    });
})()
.catch(console.log);
