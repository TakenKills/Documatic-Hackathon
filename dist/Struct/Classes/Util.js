"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    constructor(client) {
        this.client = client;
        this.client = client;
        this.config = this.client.config;
    }
    randomINT(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomBool() {
        return Math.random() >= 0.5;
    }
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    randomElem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    isOwner(id) {
        return this.config.owners.includes(id);
    }
    setKV(obj, key, value) {
        obj[key] = value;
    }
    getKey(obj, key) {
        return obj[key];
    }
    deleteKey(obj, key) {
        delete obj[key];
    }
    getRepeatedChar(str, char) {
        const chars = {};
        for (const _ of str) {
            chars[char] = (chars[char] || 0) + 1;
        }
        return Object.entries(chars)
            .filter((char) => char[1] > 1)
            .map((char) => char[0]);
    }
    async disableComponents(interaction) {
        const message = await this.client.getMessage(interaction.channel.id, interaction.message.id);
        if (!message)
            return;
        if (message.components && message.components.length <= 0)
            return;
        for (const ActionRow of interaction.message.components) {
            for (const component of ActionRow.components) {
                component.disabled = true;
            }
        }
        interaction.message.edit({ components: interaction.message.components }).catch((e) => e);
    }
}
exports.Util = Util;
