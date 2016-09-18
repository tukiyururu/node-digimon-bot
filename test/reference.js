import { assert } from 'chai';
import Reference from '../src/reference';

describe('デジモン図鑑', function() {
    const ref = new Reference();

    before(function() {
        this.timeout(60000);
        return ref.getDic();
    });

    describe('検索', function() {
        it('メタルグレイモン種', function() {
             const mons = [
                'メタルグレイモン',
                'メタルグレイモンウィルス',
                'メタルグレイモン（ウィルス種）',
                'メタルグレイモン(ウィルス種)',
                'メタグレイモン'
            ].map(function(mon) {
                return ref.search(ref.parseStr(mon));
            });

            for (let mon of mons[0]) {
                assert.equal(mon.name.indexOf('メタルグレイモン'), 0);
            }
            for (let monV of mons.slice(1,4)) {
                assert.lengthOf(monV, 1);
                assert.equal('メタルグレイモン（ウィルス種）', monV[0].name);
            }
            assert(Array.isArray(mons[4]));
        });
    });
});
