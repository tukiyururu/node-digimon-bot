import 'babel-polyfill';
import { assert } from 'chai';
import co from 'co';
import client from '../src/client';
import util from '../src/util';

describe('Twitterクライアント', function() {
    describe('ツイート機能をテストする', function() {
        const url = 'http://digimon.net/cat-digimon-dictionary/03-sa/salamandamon/img-digmon.jpg';
        const text = `RT サラマンダモン - デジモン図鑑 l デジモンオフィシャルポータルサイト デジモンウェブ http://digimon.net/cat-digimon-dictionary/03-sa/salamandamon/ #${util.random()} `;

        it('update tweet', function() {
            this.timeout(30000);
            return client.update({ status: text + url })
                  .then(tweet => {
                        assert.equal(client.screenName, tweet.user.screen_name);
                        assert(tweet.text);
                  });
        });

        it('upload net media', function(){
            this.timeout(30000);
            return co(function *() {
                const img = yield util.rp(url, { encoding: null });
                yield client.upload(img, { status: text })
                      .then(client.update)
                      .then(tweet => {
                        assert.equal(client.screenName, tweet.user.screen_name);
                        assert(tweet.text);
                    });
            });
        });
    });
});
