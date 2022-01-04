"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const events_1 = require("events");
//@ts-expect-error
const readdir_recursive_1 = __importDefault(require("readdir-recursive"));
const path_1 = require("path");
const { fileSync } = new readdir_recursive_1.default();
class EventHandler extends events_1.EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.client = client;
        this.events = new Map();
        for (const dir of fileSync(path_1.resolve("dist/Struct/Event/events")))
            this.register_event(dir);
    }
    register_event(event_path) {
        const event = new (require(event_path))(this.client);
        event.path = event_path;
        event.client = this.client;
        this.events.set(event.name, event);
        if (event.emitter == "client")
            this.client[event.once ? "once" : "on"](event.name, async (...args) => await event.execute(...args));
        else
            this.client.CommandHandler[event.once ? "once" : "on"](event.name, async (...args) => await event.execute(...args));
    }
}
exports.EventHandler = EventHandler;
