"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBase = void 0;
class EventBase {
    constructor(obj) {
        var _a;
        this.name = obj.name;
        this.once = (_a = obj.once) !== null && _a !== void 0 ? _a : false;
        this.emitter = obj.emitter || "client";
    }
}
exports.EventBase = EventBase;
