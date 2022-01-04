"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectMenuConstructor = void 0;
class SelectMenuConstructor {
    constructor(client) {
        this.client = client;
        this.type = 3;
        this.disabled = false;
        this.custom_id = "";
        this.max_values = 1;
        this.min_values = 1;
        this.options = [];
        this.placeholder = "";
        this.client = client;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }
    setMaxValues(max_values) {
        this.max_values = max_values;
        return this;
    }
    setMinValues(min_values) {
        this.min_values = min_values;
        return this;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    addOption(option) {
        this.options.push(option);
        return this;
    }
    addOptions(options) {
        this.options.push(...options);
        return this;
    }
    setOptions(options) {
        this.options = options;
        return this;
    }
    setID(custom_id) {
        this.custom_id = custom_id;
        return this;
    }
    setCallback(callback, timeout, ...rest) {
        this.client.function_loop[this.custom_id] = { function: callback, paramaters: rest, timeout };
        return this;
    }
}
exports.SelectMenuConstructor = SelectMenuConstructor;
