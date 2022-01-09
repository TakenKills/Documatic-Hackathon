import { ComponentInteraction, Message } from "eris";
import { ActionRowConstructor, ButtonConstructor } from "../../../Classes";
import { CommandBase } from "../../CommandBase";

type Placement = [number, number];
type Placements = { playerPlacement: Placement; holePlacement: Placement; ballPlacement: Placement };

type Field = { placement: Placements; base: number[][]; frame: string };

const ROW_LENGTH = 11;
const ROW_NUMBER = 8;

// (ROW, INDEX)

const getLevelPlacements = (level?: number): Placements | undefined => {
	if (!level) return;

	// randomize the placement of the ball and hole
	const ballPlacement: Placement = [
		Math.floor(Math.random() * (ROW_NUMBER - 2)) + 1,
		Math.floor(Math.random() * (ROW_LENGTH - 2)) + 1
	];
	const holePlacement: Placement = [
		Math.floor(Math.random() * (ROW_NUMBER - 1)) + 1,
		Math.floor(Math.random() * (ROW_LENGTH - 1)) + 1
	];

	if (ballPlacement[1] === ROW_LENGTH - 1) ballPlacement[1]--;

	if (ballPlacement[1] < 0) ballPlacement[1] = 1;

	if (ballPlacement[0] === ROW_NUMBER) ballPlacement[0]--;

	if (holePlacement === ballPlacement) return getLevelPlacements(level);

	// make the player spawn right to the ball
	const playerPlacement: Placement = [ballPlacement[0], ballPlacement[1] - 1];

	return { playerPlacement, holePlacement, ballPlacement };
};

class Course {
	public level;
	public field: Field;
	public frame: string;
	public placements: Placements;

	constructor(level?: number) {
		this.level = level ? level : 0;
		this.field = this.generate_field(this.level > 0 ? getLevelPlacements(this.level) : undefined);
		this.frame = this.field.frame;
		this.placements = this.field.placement;
	}

	public generate_field(Placements?: Placements): Field {
		const base = new Array(ROW_NUMBER).fill(0).map(() => new Array(ROW_LENGTH).fill(" ⬛ "));

		let playerPlacement = Placements?.playerPlacement;
		let holePlacement = Placements?.holePlacement;
		let ballPlacement = Placements?.ballPlacement;

		if (!playerPlacement) playerPlacement = [base.length - 2, 5];
		if (!holePlacement) holePlacement = [1, 5];
		if (!ballPlacement) ballPlacement = [playerPlacement[0] - 1, playerPlacement[1]];

		if (playerPlacement[0] === holePlacement[0] && playerPlacement[1] === holePlacement[1]) playerPlacement[0]++;

		base[playerPlacement[0]][playerPlacement[1]] = "  👨‍🦲  ";
		base[holePlacement[0]][holePlacement[1]] = " 🌀 ";
		base[ballPlacement[0]][ballPlacement[1]] = " 🥎 ";

		const frame = `${base.map((row) => row.join("")).join("\n")}`;

		return { base, placement: { playerPlacement, holePlacement, ballPlacement }, frame };
	}

	public edit_ball(placement: Placement) {
		this.field.placement.ballPlacement = placement;
		this.placements = this.field.placement;

		return this;
	}

	public edit_player(placement: Placement) {
		this.field.placement.playerPlacement = placement;
		this.placements = this.field.placement;

		return this;
	}

	public next_level() {
		this.level++;
		return this.update(this.level);
	}

	public update(level?: number) {
		this.field = this.generate_field(level ? getLevelPlacements(level) : this.placements);
		this.frame = this.field.frame;
		this.placements = this.field.placement;

		return this;
	}
}

export = class Golf extends CommandBase {
	public constructor() {
		super("golf", {
			category: "games",
			description: "Play a game of golf, that consists of infinite levels!",
			usage: "golf",
			clientPermissions: ["embedLinks"],
			cooldown: 30
		});
	}

	public execute(message: Message, _: string[], level?: number): void {
		const how_to_play = this.client.embeds
			.regular()
			.setTitle("Golf! How to play:")
			.setDescription(
				"You use the arrow keys to move the ball around the field (moves 2 blocks).\nyou can move the ball only when your player is near it.\nYou move your player using the pointer fingers.\nTo win and advance to the next level you have to get the ball near (1 block radius).\nHave fun!"
			);

		this.client.createMessage(message.channel.id, { embed: how_to_play }).then((msg) => {
			setTimeout(() => {
				msg.delete();

				const course = new Course(level);

				const embed = this.client.embeds.regular().setTitle("Golf!").setDescription(course.frame).setTimestamp();

				const btns = new Array(20).fill(0).map((_, i) =>
					new ButtonConstructor(this.client)
						.setLabel("\u200b")
						.setID(`DISABLED_${message.guildID ?? message.author.id}_${i}`)
						.setDisabled(true)
						.setCallback(() => void 0, 300000)
				);

				const ball_movement_btns = new Array(4).fill(0).map(() => new ButtonConstructor(this.client));

				ball_movement_btns[0].setLabel("⬅️").setID("left").setCallback(this.cb, 300000, this, message, course);
				ball_movement_btns[1].setLabel("➡️").setID("right").setCallback(this.cb, 300000, this, message, course);
				ball_movement_btns[2].setLabel("⬆️").setID("up").setCallback(this.cb, 300000, this, message, course);
				ball_movement_btns[3].setLabel("⬇️").setID("down").setCallback(this.cb, 300000, this, message, course);

				const player_movement_btns = new Array(4).fill(0).map(() => new ButtonConstructor(this.client));

				player_movement_btns[0].setLabel("👈").setID("leftP").setCallback(this.cb, 300000, this, message, course);
				player_movement_btns[1].setLabel("👉").setID("rightP").setCallback(this.cb, 300000, this, message, course);
				player_movement_btns[2].setLabel("👆").setID("upP").setCallback(this.cb, 300000, this, message, course);
				player_movement_btns[3].setLabel("👇").setID("downP").setCallback(this.cb, 300000, this, message, course);

				const rows = new Array(4).fill(0).map(() => new ActionRowConstructor().setComponents(btns.splice(0, 5)));

				rows[0].setComponent(ball_movement_btns[2], 2);
				rows[1].setComponent(ball_movement_btns[0], 1);
				rows[1].setComponent(ball_movement_btns[1], 3);
				rows[1].setComponent(ball_movement_btns[3], 2);

				rows[2].setComponent(player_movement_btns[2], 2);
				rows[3].setComponent(player_movement_btns[0], 1);
				rows[3].setComponent(player_movement_btns[1], 3);
				rows[3].setComponent(player_movement_btns[3], 2);

				this.client.createMessage(message.channel.id, { embed, components: rows });
			}, 10000);
		});
	}

	public async cb(interaction: ComponentInteraction, self: this, message: Message, course: Course): Promise<any> {
		if (interaction.member?.id !== message.author.id) return;

		const { custom_id: id } = interaction.data;

		const [rP, xP] = course.placements.playerPlacement;
		const [rB, xB] = course.placements.ballPlacement;

		// ball movement
		switch (id) {
			case "left":
				if (rB === rP && xB === xP - 1) {
					let ballX = xB - 3;
					if (ballX < 0) ballX = 0;
					course.edit_ball([rB, ballX]);

					self.checkWin(interaction, message, course);
				} else {
					return interaction.acknowledge();
				}
				break;
			case "right":
				if (rB === rP && xB === xP + 1) {
					let ballX = xB + 3;
					if (ballX > ROW_LENGTH - 1) ballX = ROW_LENGTH - 1;
					course.edit_ball([rB, ballX]);
					self.checkWin(interaction, message, course);
				} else {
					return interaction.acknowledge();
				}
			case "up":
				if (rP - rB === 1 && xB === xP && rP > 0) {
					let ballR = rP - 3;
					if (ballR < 0) ballR = 0;

					course.edit_ball([ballR, xB]);
					self.checkWin(interaction, message, course);
				} else {
					return interaction.acknowledge();
				}

				break;
			case "down":
				if (rB === rP + 1 && xB === xP && rP < ROW_NUMBER - 1) {
					let ballR = rP + 3;
					if (ballR > ROW_NUMBER - 1) ballR = ROW_NUMBER - 1;

					course.edit_ball([ballR, xB]);
					self.checkWin(interaction, message, course);
				} else {
					return interaction.acknowledge();
				}

				break;
		}

		// player movement
		switch (id) {
			case "leftP":
				if ((rP === rB && xP === xB - 1) || xP - 1 < 0) {
					return interaction.acknowledge();
				}

				course.edit_player([rP, xP - 1]);
				break;
			case "rightP":
				if ((rP === rB && xP === xB + 1) || xP + 1 > ROW_LENGTH - 1) {
					return interaction.acknowledge();
				}

				course.edit_player([rP, xP + 1]);
				break;

			case "upP":
				if ((rP - 1 === rB && xP === xB) || rP - 1 < 0) {
					return interaction.acknowledge();
				}

				course.edit_player([rP - 1, xP]);
				break;

			case "downP":
				if ((rP + 1 === rB && xP === xB) || rP + 1 > ROW_NUMBER - 1) {
					return interaction.acknowledge();
				}

				course.edit_player([rP + 1, xP]);
				break;
		}

		interaction.acknowledge();

		interaction.message.embeds[0].description = course.update().frame;

		interaction.message.edit({ embed: interaction.message.embeds[0] });
	}

	private checkWin(interaction: ComponentInteraction, message: Message, course: Course): void {
		const [rB, xB] = course.placements.ballPlacement;
		const [rH, xH] = course.placements.holePlacement;

		const viable_spots = [
			[rH, xH], // hole
			[rH - 1, xH], // up
			[rH + 1, xH], // down
			[rH, xH - 1], // left
			[rH, xH + 1], // right
			[rH - 1, xH - 1], // up left
			[rH - 1, xH + 1], // up right
			[rH + 1, xH - 1], // down left
			[rH - 1, xH + 1] // down right
		];

		let won = false;

		for (const [r, x] of viable_spots)
			if (r === rB && x === xB) {
				won = true;
				break;
			} else won = false;

		if (!won) return;

		const row = new ActionRowConstructor()
			.addComponent(
				new ButtonConstructor(this.client)
					.setLabel("End")
					.setID("End")
					.setStyle("DANGER")
					.setCallback(this.end, 15000, this, message, course)
			)
			.addComponent(
				new ButtonConstructor(this.client)
					.setLabel("Next Level")
					.setID("next")
					.setCallback(this.nextLevel, 15000, this, message, course)
			);

		interaction.message.edit({
			content: `Nice! You won!\nCurrent level: ${course.level}\npoints gained: ${course.level * 15}`,
			embeds: [],
			components: [row]
		});
	}

	public nextLevel(interaction: ComponentInteraction, self: this, message: Message, course: Course): void {
		course.next_level();
		interaction.message.delete();

		self.execute(message, [], course.level);
	}

	public end(interaction: ComponentInteraction, self: this, message: Message, course: Course): void {
		interaction.message.delete();

		const gained_points = course.level * 15;

		self.client.addPoints(message.author.id, gained_points);

		const embed = self.client.embeds
			.success()
			.setTitle(`You've completed ${course.level} levels!`)
			.setDescription(`You've gained \`${gained_points}\` points!`)
			.setTimestamp()
			.setFooter(`Player: ${message.author.tag}`, message.author.dynamicAvatarURL());

		self.client.createMessage(message.channel.id, { embed });
	}
};
