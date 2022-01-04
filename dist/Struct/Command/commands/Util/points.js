"use strict";
const CommandBase_1 = require("../../CommandBase");
module.exports = class Points extends CommandBase_1.CommandBase {
    constructor() {
        super("points", {
            aliases: ["pt", "pts"],
            category: "Utility",
            description: "Check your points.",
            usage: "points"
        });
    }
    async execute(message) {
        const points = await this.client.get_points(message.author.id);
        const embed = this.client.embeds
            .regular()
            .setAuthor(message.author.username, message.author.dynamicAvatarURL())
            .setTitle("Points")
            .setDescription(`You have ${points} points.`);
        return message.channel.createMessage({ embed });
    }
};
