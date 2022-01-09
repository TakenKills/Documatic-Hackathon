"use strict";
const CommandBase_1 = require("../../CommandBase");
module.exports = class Leaderboard extends CommandBase_1.CommandBase {
    constructor() {
        super("leaderboard", {
            aliases: ["lb"],
            category: "Utility",
            description: "Check the global leaderboard.",
            usage: "leaderboard"
        });
    }
    async execute(message) {
        const lb = await this.client.getLeaderboard();
        const view = lb
            .map((user) => {
            return `${user.username} - ${user.points} Points`;
        })
            .join("\n");
        const embed = this.client.embeds.regular().setTitle("Global Leaderboard:").setDescription(view).setTimestamp();
        return this.client.createMessage(message.channel.id, { embed });
    }
};
