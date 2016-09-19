import { assert } from 'chai';
import Reference from '../src/reference';

describe('デジモン図鑑', function() {
    const ref = new Reference();

    before(function() {
        this.timeout(60000);
        return ref.getDic();
    });

    it('全デジモンの正規表現', function() {
        for (let dic of ref.dic) {
            if (dic.name.indexOf('イグドラシル') !== -1) return;
            assert.equal(dic.name, ref.parseStr(dic.name)[0]);
        }
    });

    describe('デジモン図鑑を検索', function() {
        it('正しい検索をするか', function() {
             const metalGreymons = [
                'メタルグレイモン',
                'メタルグレイモンウィルス',
                'メタルグレイモン（ウィルス種）',
                'メタルグレイモン(ウィルス種)',
                'メタルグレイモンモン',
                'メタルグレイモン（',
                'メタルグレイモン(',
                'メタグレイモン'
            ].map(function(metalGreymon) {
                return ref.search(ref.parseStr(metalGreymon));
            });

            for (let metalGreymon of metalGreymons[0]) {
                assert.equal(metalGreymon.name.indexOf('メタルグレイモン'), 0);
            }
            for (let metalGreymonV of metalGreymons.slice(1,4)) {
                assert.lengthOf(metalGreymonV, 1);
                assert.equal('メタルグレイモン（ウィルス種）', metalGreymonV[0].name);
            }
            for (let notMons of metalGreymons.slice(4,metalGreymons.length)) {
                assert.deepEqual(notMons, []);
            }
        });
    });
});
