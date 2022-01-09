import { Message, User, ComponentInteraction, Constants } from "eris";
import { ActionRowConstructor, ButtonConstructor } from "../../../Classes";
import { CommandBase } from "../../CommandBase";

enum Blocks {
	EMPTY = 0,
	RED = 1,
	YELLOW = 2
}

interface Turn {
	user: User;
	color: Blocks.RED | Blocks.YELLOW;
}

class Board {
	public readonly table: number[][];
	public readonly toString: () => string;
	public readonly switch_turn: () => Turn;
	public readonly players: [User, User];
	public turn: Turn;

	constructor([Player1, Player2]: [User, User]) {
		this.table = new Array(7).fill(0).map(() => new Array(6).fill(Blocks.EMPTY));

		this.players = [Player1, Player2];
		this.turn = { user: Player1, color: Blocks.RED };
		this.switch_turn = () => {
			this.turn.color = this.turn.color === Blocks.RED ? Blocks.YELLOW : Blocks.RED;
			this.turn.user = this.turn.user === Player1 ? Player2 : Player1;

			return this.turn;
		};

		this.toString = () => {
			const table_map = this.table.map((column) => {
				return column.map((block) => {
					switch (block) {
						case Blocks.EMPTY:
							return "⬛";
						case Blocks.RED:
							return "🔴";
						case Blocks.YELLOW:
							return "🟡";
					}
				});
			});

			return Array.from(Array(table_map[0].length), (_, idx) => table_map.map((block) => block[idx]).join(" | ")).join(
				"\n"
			);
		};
	}

	public get preview() {
		return this.toString();
	}

	public add_block(column: number, color: Blocks.RED | Blocks.YELLOW) {
		if (this.table[column][0] !== Blocks.EMPTY) return false;

		// make a for loop that counts down from the column's length
		for (let i = this.table[column].length - 1; i >= 0; i--) {
			if (this.table[column][i] === Blocks.EMPTY) {
				this.table[column][i] = color;
				break;
			}
		}

		return true;
	}

	public check_win() {
		// check for horizontal win
		for (let i = 0; i < this.table.length; i++) {
			for (let j = 0; j < this.table[i].length; j++) {
				if (this.table[i][j] === Blocks.EMPTY) continue;

				try {
					if (
						this.table[i][j] === this.table[i][j + 1] &&
						this.table[i][j] === this.table[i][j + 2] &&
						this.table[i][j] === this.table[i][j + 3]
					) {
						return this.players[this.table[i][j] - 1];
					}
				} catch (_) {
					void 0;
				}
			}
		}

		// check for a vertical win
		for (let i = 0; i < this.table.length; i++) {
			for (let j = 0; j < this.table[i].length; j++) {
				if (this.table[i][j] === Blocks.EMPTY) continue;
				try {
					if (
						this.table[i][j] === this.table[i - 1][j] &&
						this.table[i][j] === this.table[i - 2][j] &&
						this.table[i][j] === this.table[i - 3][j]
					) {
						return this.players[this.table[i][j] - 1];
					}
				} catch (_) {
					void 0;
				}
			}
		}

		// check for a diagonal win
		for (let i = 0; i < this.table.length; i++) {
			for (let j = 0; j < this.table[i].length; j++) {
				if (this.table[i][j] === Blocks.EMPTY) continue;
				try {
					if (
						(this.table[i][j] === this.table[i - 1][j + 1] &&
							this.table[i][j] === this.table[i - 2][j + 2] &&
							this.table[i][j] === this.table[i - 3][j + 3]) ||
						(this.table[i][j] === this.table[i - 1][j - 1] &&
							this.table[i][j] === this.table[i - 2][j - 2] &&
							this.table[i][j] === this.table[i - 3][j - 3])
					) {
						return this.players[this.table[i][j] - 1];
					}
				} catch (_) {
					void 0;
				}
			}
		}
	}
}

export = class ConnectFour extends CommandBase {
	constructor() {
		super("connectfour", {
			aliases: ["cf"],
			category: "games",
			description: "Play Connect Four.",
			usage: "connectfour [@user | user_id]",
			clientPermissions: ["embedLinks"],
			cooldown: 30
		});
	}

	reset_cooldown(user: User) {
		const cooldowns = this.client.CommandHandler.cooldowns.get("connectfour")!;

		if (cooldowns.has(user.id)) {
			this.client.CommandHandler.cooldowns.get("connectfour")!.delete(user.id);
		}
	}

	execute(message: Message, args: string[]) {
		const user =
			message.mentions.length > 0
				? message.mentions[0]
				: this.client.users.get(args[0])
				? this.client.users.get(args[0])
				: null;
		if (!user) {
			this.reset_cooldown(message.author);
			return this.client.createMessage(message.channel.id, "You need another player to play Connect Four with!");
		}
		if (user.id === message.author.id) {
			this.reset_cooldown(message.author);
			return this.client.createMessage(message.channel.id, "Damn man, that's kinda lonely...");
		}
		if (user.id === this.client.user.id) {
			this.reset_cooldown(message.author);
			return this.client.createMessage(message.channel.id, "Awhh, you wanna play with me? I don't think so.");
		}

		const rules = this.client.embeds
			.warning()
			.setTitle("Connect Four Rules")
			.setDescription(
				`1. You win by connecting four of your pieces in a row. whether horizontally, vertically, or diagonally.
				2. You can only place your pieces on empty spaces.
				3. You can only place your pieces in the column of your choosing.
				4. Winner gets 30 points.
				5. Have fun!`
			)
			.setTimestamp();

		this.client.createMessage(message.channel.id, { embed: rules }).then((message) =>
			setTimeout(() => {
				message.delete();

				const board = new Board([message.author, user]);

				const embed = this.client.embeds
					.regular()
					.setTitle(`Connect Four!`)
					.setDescription(board.preview)
					.setFooter(`${message.author.username} (Red) vs ${user.username} (Yellow)`)
					.setTimestamp();

				const btns = new Array(7).fill(0).map((_, i) =>
					new ButtonConstructor(this.client)
						.setLabel(`Column #${i + 1}`)
						.setID(`column_${i}`)
						.setCallback(this.choose_column, 300000, this, board)
				);

				const row = new ActionRowConstructor().setComponents(btns.slice(0, 4));

				const row2 = new ActionRowConstructor().setComponents(btns.slice(4, btns.length));

				const exit_button = new ButtonConstructor(this.client)
					.setLabel("EXIT")
					.setStyle("DANGER")
					.setID(`exit-game_${message.author.id}`)
					.setCallback(this.exit, 300000, this);

				row2.setComponent(exit_button, 3);

				this.client.createMessage(message.channel.id, {
					embed,
					content: `${message.author.mention} please choose a column to place your block in.`,
					components: [row, row2]
				});
			}, 8500)
		);
	}

	public exit(interaction: ComponentInteraction, self: this, original: ComponentInteraction) {
		const row = new ActionRowConstructor().addComponents([
			new ButtonConstructor(self.client)
				.setLabel("CONFIRM")
				.setID("confirm_exit_EPH")
				.setCallback(self.exit, 20000, self, interaction),
			new ButtonConstructor(self.client)
				.setLabel("CANCEL")
				.setID("cancel_exit_EPH")
				.setCallback(self.exit, 20000, self, interaction)
		]);

		if (interaction.data.custom_id === "confirm_exit_EPH") {
			const user = interaction.member ? interaction.member.user : interaction.user!;

			interaction.acknowledge();

			if (original.data.custom_id.split("_")[2] === "EPH") return;

			return original.message.edit({
				content: "",
				embeds: [self.client.embeds.success().setDescription(`Game ended by ${user.username}`)],
				components: []
			});
		} else if (interaction.data.custom_id === "cancel_exit_EPH") {
			return interaction.acknowledge();
		}

		return interaction.createMessage({
			content: "Are you sure you want to quit?",
			flags: Constants.MessageFlags.EPHEMERAL,
			components: [row]
		});
	}

	public choose_column(interaction: ComponentInteraction, self: this, board: Board) {
		let current_turn = board.turn;

		if (interaction.member?.id !== current_turn.user.id) {
			return interaction.createMessage({
				content: "It's not your turn.",
				flags: Constants.MessageFlags.EPHEMERAL
			});
		}

		const column = parseInt(interaction.data.custom_id.split("_")[1]);

		if (board.add_block(column, current_turn.color)) {
			current_turn = board.switch_turn();

			const embed = interaction.message.embeds[0];
			embed.description = board.preview;

			interaction.message.edit({ embed, content: `${current_turn.user.username}, Pick a column to place your block.` });

			interaction.deferUpdate();

			return self.check_win(board, self, interaction);
		} else {
			return interaction.createMessage({
				content: "That column is full, Please choose another one.",
				flags: Constants.MessageFlags.EPHEMERAL
			});
		}
	}

	public async check_win(board: Board, self: this, interaction: ComponentInteraction) {
		const winner = board.check_win();

		if (winner) {
			const embed = this.client.embeds
				.regular()
				.setTitle(`${winner.username} wins and gains 30 points!`)
				.setDescription(board.preview)
				.setTimestamp();

			await self.client.addPoints(winner.id, 30);

			interaction.message.edit({ embed, content: "", components: [] });
		}
	}
};
