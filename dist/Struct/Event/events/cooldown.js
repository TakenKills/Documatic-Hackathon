"use strict";
const EventBase_1 = require("../EventBase");
module.exports = class Cooldown extends EventBase_1.EventBase {
    constructor() {
        super({ name: "cooldown", emitter: "commandhandler" });
    }
    execute(message, _, timeLeft) {
        let time;
        if (timeLeft < 59000)
            time = timeLeft.toFixed(2) + " seconds";
        else {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft - minutes * 60000) / 1000);
            time = minutes + " minutes and " + seconds + " seconds";
        }
        message.channel.createMessage({
            content: `you have to wait \`${time}\` before using this command again.`,
            messageReference: { messageID: message.id }
        });
    }
};
