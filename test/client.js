import 'babel-polyfill';
import { assert } from 'chai';
import co from 'co';
import client from '../src/client';
import util from '../src/util';

describe('Twitterクライアント', function() {
    describe('ツイート機能をテストする', function() {
        const text = `RT サラマンダモン - デジモン図鑑 l デジモンオフィシャルポータルサイト デジモンウェブ https://goo.gl/1EVlvW #${util.random()}`;
        const imgUrl = 'http://digimon.net/cat-digimon-dictionary/03-sa/salamandamon/img-digmon.jpg';

        it('update', function() {
            return client.update({ status: text })
                  .then(assert.isNotNull);
        });

        it('upload net media', function(){
            this.timeout(30000);

            return co(function *() {
                const img = yield util.rp(imgUrl, { encoding: null });
                yield client.upload(img, { status: text })
                      .then(client.update);
            })
            .then(assert.isNotNull);
        });
    });
});
