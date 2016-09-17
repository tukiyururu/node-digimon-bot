import Reference from './digimon-reference';

module.exports = () => {
    const ref = new Reference();

    ref.getDics()
    .then(() => {
        ref.search(ref.parseString('メタルグレイモン'));
        ref.search(ref.parseString('メタルグレイモンウィルス'));
        ref.search(ref.parseString('メタルグレイモン（ウィルス種）'));
        ref.search(ref.parseString('メタルグレイモン(ウィルス種)'));
        ref.search(ref.parseString('メタグレイモン'));
        ref.search(ref.parseString('メタグレ'));
    })
    .catch(err => console.log(err));
};
