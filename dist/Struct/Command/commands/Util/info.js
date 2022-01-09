"use strict";
const CommandBase_1 = require("../../CommandBase");
module.exports = class Info extends CommandBase_1.CommandBase {
    constructor() {
        super("info", {
            aliases: ["about"],
            category: "Utility",
            description: "Get information about the bot.",
            usage: "info"
        });
    }
    execute(message) {
        const description = `Why hello there, ${message.author.mention}\nI'm a bot made by "TakenKiIls#0247". I'm a bot made in participation to the documatic hackathon.\n
        Links:\n[Documatic](https://www.documatic.com/)\n[Github](https://github.com/TakenKills/Documatic-Hackathon) `;
        const infoEmbed = this.client.embeds
            .regular()
            .setTitle(`Hello! I'll tell you a little about me.`)
            .setDescription(description);
        return this.client.createMessage(message.channel.id, {
            embed: infoEmbed
        });
    }
};
