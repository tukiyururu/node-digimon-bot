import got from "got";

String.prototype.exclude = function() {
    return this.replace(/[\s（）＋：種版]|X抗体/g, (s) => {
        return (s === "X抗体") ? "Ｘ" : "";
    });
};

String.prototype.zenkaku = function() {
    const str = this.replace(/[()+:（）＋：種版]|抗体/g, "");

    return str.replace(/[ -~｡-ﾟ]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
};

Array.prototype.isEmpty = function() {
    return (this.length) ? false : true;
};

export default {
    rp: async (url, opt = {}) => {
        opt.headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko"
        };
        const res = await got(url, opt);
        return res.body;
    }
};
