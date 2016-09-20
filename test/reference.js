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
            assert.equal(dic.name, dic.name.match(ref.regexp)[0]);
        }
    });

    it('正規表現の正しいマッチをしないか', function() {
       for (let notMatch of ['メタルグレイモン（', 'メタルグレイモン(']) {
            assert.isNull(notMatch.match(ref.regexp));
        }
    });
});

describe('デジモン図鑑の検索', function() {
    it('メタルグレイモンの正しい検索をするか', function() {
        const metalGreymons = ref.search('メタルグレイモン');

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
            const mGreymonV = ref.search(metalGreymonV);
            assert.lengthOf(mGreymonV, 1);
            assert.equal('メタルグレイモン（ウィルス種）', mGreymonV[0].name);
        }
    });

    it('図鑑にいないデジモンを検索しないか', function() {
        const notDigimons = [
            'メタルグレイモンモン',
            'メタグレイモン',
            'メタルグレイモン（',
            'メタルグレイモン('
        ];

        for (let notDigimon of notDigimons) {
            assert.deepEqual([], ref.search(notDigimon));
        }
    });
});
