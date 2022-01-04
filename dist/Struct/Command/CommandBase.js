"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBase = void 0;
class CommandBase {
    constructor(name, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.name = name;
        this.name = name;
        this.aliases = (_a = options.aliases) !== null && _a !== void 0 ? _a : [];
        this.guildOnly = (_b = options.guildOnly) !== null && _b !== void 0 ? _b : false;
        this.ownerOnly = (_c = options.ownerOnly) !== null && _c !== void 0 ? _c : false;
        this.description = (_d = options.description) !== null && _d !== void 0 ? _d : "";
        this.category = (_e = options.category) !== null && _e !== void 0 ? _e : "";
        this.usage = (_f = options.usage) !== null && _f !== void 0 ? _f : "";
        this.cooldown = (_g = options.cooldown) !== null && _g !== void 0 ? _g : 3;
        this.clientPermissions = (_h = options.clientPermissions) !== null && _h !== void 0 ? _h : [];
        this.memberPermissions = (_j = options.memberPermissions) !== null && _j !== void 0 ? _j : [];
    }
}
exports.CommandBase = CommandBase;
