import { Message } from "eris";
import { CommandBase } from "../../CommandBase";

export = class Leaderboard extends CommandBase {
	constructor() {
		super("leaderboard", {
			aliases: ["lb"],
			category: "Utility",
			description: "Check the global leaderboard.",
			usage: "leaderboard"
		});
	}

	public async execute(message: Message) {
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
