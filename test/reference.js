import { assert } from 'chai';
import Reference from '../src/reference';
const ref = new Reference();

before(function() {
    this.timeout(60000);
    return ref.getDic();
});

describe('デジモンの正規表現', function() {
    it('全デジモンの正規表現をテストする', function() {
        for (let dic of ref.dic) {
            // イグドラシルを一時的に除外
            if (dic.name.indexOf('イグドラシル') !== -1) return;
            assert.equal(dic.name, ref.parseStr(dic.name)[0]);
        }
    });

    it('正規表現の正しいマッチをしないか', function() {
       for (let notMatch of ['メタルグレイモン（', 'メタルグレイモン(']) {
            assert.isNull(ref.parseStr(notMatch));
        }
    });
});

describe('デジモン図鑑の検索', function() {
    it('メタルグレイモンの正しい検索をするか', function() {
        const metalGreymons = ref.search(ref.parseStr('メタルグレイモン'));

        assert.isAbove(metalGreymons.length, 1);
        for (let metalGreymon of metalGreymons) {
            assert.equal(metalGreymon.name.indexOf('メタルグレイモン'), 0);
        }
    });

    it('メタルグレイモン（ウィルス種）の正しい検索をするか', function() {
        const metalGreymonVs = [
            'メタルグレイモンウィルス',
            'メタルグレイモン（ウィルス種）',
            'メタルグレイモン(ウィルス種)',
        ];

        for (let metalGreymonV of metalGreymonVs) {
            const mGreymonV = ref.search(ref.parseStr(metalGreymonV));
            assert.lengthOf(mGreymonV, 1);
            assert.equal('メタルグレイモン（ウィルス種）', mGreymonV[0].name);
        }
    });

    it('図鑑にいないデジモンを検索しないか', function() {
        for (let notDigimon of ['メタルグレイモンモン', 'メタグレイモン']) {
            const notMon = ref.search(ref.parseStr(notDigimon));
            assert.isArray(notMon);
            assert.deepEqual(notMon, []);
        }
    });
});
