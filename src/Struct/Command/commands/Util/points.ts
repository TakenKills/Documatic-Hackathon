import { CommandBase } from "../../CommandBase";

export = class Points extends CommandBase {
	public constructor() {
		super("points", {
			aliases: ["pt", "pts"],
			category: "Utility",
			description: "Check your points.",
			usage: "points"
		});
	}

	public async execute(message: import("eris").Message) {
		const points = await this.client.get_points(message.author.id);
		const embed = this.client.embeds
			.regular()
			.setAuthor(message.author.username, message.author.dynamicAvatarURL())
			.setTitle("Points")
			.setDescription(`You have ${points} points.`);

		return this.client.createMessage(message.channel.id, { embed });
	}
};
