"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonConstructor = void 0;
const eris_1 = require("eris");
class ButtonConstructor {
    constructor(client) {
        this.client = client;
        this.type = 2;
        this.disabled = false;
        this.emoji = {};
        this.label = "";
        this.custom_id = "";
        this.style = eris_1.Constants.ButtonStyles.PRIMARY;
        this.client = client;
    }
    setID(custom_id) {
        this.custom_id = custom_id;
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }
    setEmoji(emoji) {
        this.emoji = emoji;
        return this;
    }
    setLabel(label) {
        this.label = label;
        return this;
    }
    setStyle(style) {
        this.style = eris_1.Constants.ButtonStyles[style];
        return this;
    }
    setCallback(callback, timeout, ...rest) {
        this.client.function_loop[this.custom_id] = { function: callback, paramaters: rest, timeout };
        return this;
    }
}
exports.ButtonConstructor = ButtonConstructor;
