import Reference from './reference';

module.exports = function() {
    const ref = new Reference();

    ref.getDic()
    .then(() => ref.search(ref.parseStr('メタルグレイモン')))
    .catch(err => console.log(err));
};
