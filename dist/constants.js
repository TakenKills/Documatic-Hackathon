"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFINE_PROPERTIES = exports.words = void 0;
const eris_1 = require("eris");
// 150 words.
exports.words = ['moon', 'minerals', 'known', 'river', 'floor', 'protection', 'directly', 'support', 'learn', 'cover', 'path', 'thread', 'atomic', 'brass', 'wherever', 'nearest', 'let', 'laid', 'farther', 'bow', 'blue', 'gain', 'birthday', 'accurate', 'whose', 'arrow', 'lips', 'applied', 'job', 'primitive', 'break', 'balance', 'got', 'continent', 'layers', 'song', 'hung', 'once', 'four', 'voyage', 'modern', 'fuel', 'path', 'movie', 'universe', 'field', 'fight', 'closely', 'won', 'equal', 'column', 'sets', 'worth', 'themselves', 'height', 'term', 'spin', 'classroom', 'putting', 'white', 'worse', 'say', 'birds', 'grabbed', 'horn', 'practical', 'industrial', 'myself', 'donkey', 'bigger', 'straight', 'loose', 'free', 'walk', 'skin', 'damage', 'service', 'torn', 'why', 'coal', 'worth', 'half', 'vertical', 'grade', 'frozen', 'high', 'ate', 'skin', 'entire', 'zulu', 'managed', 'invented', 'essential', 'sides', 'direction', 'upon', 'grass', 'package', 'consonant', 'colony', 'exciting', 'occasionally', 'brief', 'another', 'mysterious', 'slipped', 'voyage', 'about', 'table', 'girl', 'acres', 'troops', 'clothing', 'tonight', 'fairly', 'pay', 'steam', 'needs', 'live', 'instrument', 'she', 'threw', 'zero', 'tie', 'lower', 'vessels', 'army', 'ants', 'next', 'key', 'team', 'ground', 'include', 'explore', 'sea', 'brass', 'born', 'replace', 'wear', 'birds', 'carry', 'situation', 'are', 'mental', 'safety', 'underline', 'gave', 'base', 'model', 'member'];
function DEFINE_PROPERTIES() {
    Object.defineProperty(eris_1.User.prototype, "tag", {
        get: function () {
            return `${this.username}#${this.discriminator}`;
        }
    });
}
exports.DEFINE_PROPERTIES = DEFINE_PROPERTIES;
