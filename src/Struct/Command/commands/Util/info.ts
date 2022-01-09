import { CommandBase } from "../../CommandBase";

export = class Info extends CommandBase {
	constructor() {
		super("info", {
			aliases: ["about"],
			category: "Utility",
			description: "Get information about the bot.",
			usage: "info"
		});
	}

	public execute(message: import("eris").Message) {
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
