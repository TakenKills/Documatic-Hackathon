"use strict";
const EventBase_1 = require("../EventBase");
module.exports = class Cooldown extends EventBase_1.EventBase {
    constructor() {
        super({ name: "cooldown", emitter: "commandhandler" });
    }
    execute(message, _, timeLeft) {
        const minutes = timeLeft > 60 ? Math.floor(timeLeft / 60) : 0;
        const seconds = Math.floor(timeLeft - minutes * 60);
        const time = `${minutes > 10 ? minutes : `0${minutes}`}:${seconds > 10 ? seconds : `0${seconds}`}m`;
        message.channel.createMessage({
            content: `you have to wait \`${time}\` before using this command again.`,
            messageReference: { messageID: message.id }
        });
    }
};
