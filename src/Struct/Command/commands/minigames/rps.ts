import { ComponentInteraction, Constants, Message, User } from "eris";
import { CommandBase } from "../../CommandBase";
import { ActionRowConstructor, ButtonConstructor } from "../../../Classes";

type Choice = { choice: string; ID: string };

class Game {
	public choices: Choice[];
	public bot: boolean;

	constructor(public readonly players: [User, User | null | undefined]) {
		this.players = players;

		this.bot = !this.players[1] ? true : false;

		this.choices = [];
	}

	public add_choice(choice: string, ID: string) {
		this.choices.push({ choice, ID });
		return this;
	}
}

export = class RPS extends CommandBase {
	constructor() {
		super("rockpaperscissors", {
			description: "Play rock paper scissors with the bot!",
			category: "games",
			usage: "rps",
			aliases: ["rps"],
			clientPermissions: ["embedLinks"],
			cooldown: 10
		});
	}

	public async execute(message: Message, args: string[]) {
		const user =
			message.mentions.length > 0
				? message.mentions[0]
				: this.client.users.get(args[0])
				? this.client.users.get(args[0])
				: null;

		const game = new Game([message.author, user ? user : null]);

		if (!user) {
			const choices = ["rock", "paper", "scissors"];
			const choice = choices[this.client.util.randomINT(0, choices.length)];
			game.add_choice(choice, this.client.user.id);
		}

		const btn = new ButtonConstructor(this.client)
			.setID(`rps_rock`)
			.setLabel("Rock")
			.setEmoji({ name: "✊" })
			.setCallback(this.cb, 15000, this, game);
		const btn2 = new ButtonConstructor(this.client)
			.setID(`rps_paper`)
			.setLabel("Paper")
			.setEmoji({ name: "✋" })
			.setCallback(this.cb, 15000, this, game);
		const btn3 = new ButtonConstructor(this.client)
			.setID(`rps_scissors`)
			.setLabel("Scissors")
			.setEmoji({ name: "✌️" })
			.setCallback(this.cb, 15000, this, game);

		const row = new ActionRowConstructor().setComponents([btn, btn2, btn3]);

		this.client.createMessage(message.channel.id, {
			components: [row],
			content: `${message.author.mention} Pick either \`rock\`, \`paper\`, or \`scissors\`.`
		});
	}

	private async cb(interaction: ComponentInteraction, self: this, game: Game) {
		if (interaction.data.component_type !== Constants.ComponentTypes.BUTTON) return;

		const clicker = interaction.member ? interaction.member : interaction.user!;

		game.add_choice(interaction.data.custom_id.split("_")[1], clicker.id);

		if (game.choices.length > 1) {
			const winner = self.check_winner(game.choices[0], game.choices[1]);

			if (winner === "tie") {
				interaction.message.edit({ content: `${game.bot ? "We" : "You both"} Tied!`, components: [] });
			} else {
				const winner_user = game.players[winner as number]!;
				const loser_user = game.players[1 - (winner as number)];

				const content = `${winner_user ? (game.bot ? "You" : winner_user.mention) : "I"} won, unfortunate for ${
					loser_user ? `you ${loser_user.mention}` : "me."
				}.`;

				interaction.message.edit({
					content,
					components: []
				});
			}
		}

		if (game.choices.length < 2)
			interaction.message.edit({ content: `${clicker.mention} has picked! you better hurry dude...` });

		interaction.acknowledge();
	}

	private check_winner(player1: Choice, player2: Choice): string | number {
		let winner = -1; // -1 = tie, 0 = player1, 1 = player2

		if (player1.choice === "rock" && player2.choice === "paper") winner = 1;
		else if (player1.choice === "rock" && player2.choice === "scissors") winner = 0;
		else if (player1.choice === "paper" && player2.choice === "rock") winner = 0;
		else if (player1.choice === "paper" && player2.choice === "scissors") winner = 1;
		else if (player1.choice === "scissors" && player2.choice === "rock") winner = 1;
		else if (player1.choice === "scissors" && player2.choice === "paper") winner = 0;
		else winner = -1;

		if (winner === -1) return "tie";
		else return winner;
	}
};

/*
const gain = winner === 1 ? 0 : winner === 2 ? 10 : 5;

		const embed = self.client.embeds[winner === 2 ? "success" : winner === 1 ? "error" : "warning"]()
			.setTitle(`${interaction.data.custom_id.slice(4)} vs ${choice}`)
			.setDescription(`${winner === 2 ? "You won!" : winner === 1 ? "I won!" : "It's a Tie!"}`)
			.setFooter(`You gained ${gain} points!`)
			.setTimestamp();

		interaction.message.edit({ embeds: [embed], components: [], content: "" });

		await self.client.addPoints(authorID, gain);
*/
