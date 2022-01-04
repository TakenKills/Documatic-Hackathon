"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRowConstructor = void 0;
class ActionRowConstructor {
    constructor() {
        this.type = 1;
        this.components = [];
    }
    setComponents(components) {
        this.components = components;
        return this;
    }
    setComponent(component, index) {
        this.components[index] = component;
        return this;
    }
    addComponent(component) {
        this.components.push(component);
        return this;
    }
    addComponents(components) {
        this.components.push(...components);
        return this;
    }
}
exports.ActionRowConstructor = ActionRowConstructor;
