import got from "got";

module.exports = async (url, opt = {}) => {
    opt.headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko"
    };
    const res = await got(url, opt);
    console.log(url);
    return res.body;
};
