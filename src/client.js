require("dotenv").load({ silent: true });
import Twitter from "Twitter";

const client = new Twitter({
    consumer_key:        process.env.CONSUMER_KEY,
    consumer_secret:     process.env.CONSUMER_SECRET,
    access_token_key:    process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

export default {
    name: process.env.SCREEN_NAME,

    update: (params, data) => {
        return new Promise((resolve, reject) => {
            client.post("media/upload", { media: data }, (err, media) => {
                if (err) reject(err);
                params.media_ids = media.media_id_string;

                client.post("statuses/update", params, (err) => {
                    if (err) reject(err);
                });
            });
        });
    },

    stream: cb => {
        client.stream("user", (stream) => {
            stream.on("data", (status) => {
                if (status.text && !status.retweeted_status) {
                    cb(status.text);
                }
            });
            stream.on("error", console.log);
        });
    }
};
