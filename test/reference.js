import { assert } from 'chai';
import Reference from '../src/reference';
const ref = new Reference();

before(function() {
    this.timeout(50000);
    return ref.getDic();
});

describe('デジモンの正規表現', function() {
    it('全デジモンのテストをする', function() {
        for (let dic of ref.dic) {
            if (dic.name.indexOf('イグドラシル') !== -1) return;
            assert.equal(dic.name, dic.name.match(ref.regexp)[0]);
        }
    });
});

describe('デジモン図鑑の検索', function() {
    it('メタルグレイモンの正しい検索をするか', function() {
        const mGreymons = ref.search('メタルグレイモン');

        assert.isAbove(mGreymons.length, 1);
        for (let mGreymon of mGreymons) {
            assert.equal(mGreymon.name.indexOf('メタルグレイモン'), 0);
        }
    });

    it('メタルグレイモン（ウィルス種）の正しい検索をするか', function() {
        const mGreymonVs = [
            'メタルグレイモン（ウィルス種）',
            'メタルグレイモン(ウィルス種)',
            'メタルグレイモンウィルス',
            'メタルグレイモン（青）',
            'メタルグレイモン(青)',
            'メタルグレイモン青',
        ];

        for (let mGreymonV of mGreymonVs) {
            let monV = ref.search(mGreymonV);
            assert.lengthOf(monV, 1);
            assert.equal(mGreymonVs[0], monV[0].name);
        }
    });

    it('イグドラシルの正しい検索をするか', function() {
        const yggdras = [
            'イグドラシル＿７Ｄ６',
            'イグドラシル７Ｄ６',
            'イグドラシル_7D6',
            'イグドラシル7D6',
            'イグドラシル',
        ];

        for (let yggdra of yggdras) {
            let ygg = ref.search(yggdra);
            assert.lengthOf(ygg, 1);
            assert.equal(yggdras[0], ygg[0].name);
        }
    });

    it('図鑑にないデジモンを検索をしないか', function() {
        const notMons = [
            'メタルグレイモン（',
            'メタルグレイモン(',
            'メタルグレイモンモン',
            'メタルグレイモンモン（ウィルス種）',
            'メタグレイモン',
            'イグドラシル＿',
            'イグドラシル＿７Ｄ６Ｆ',
        ];

        for (let notMon of notMons) {
            assert.deepEqual([], ref.search(notMon));
        }
    });
});
