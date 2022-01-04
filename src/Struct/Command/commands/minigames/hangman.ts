import { ComponentInteraction } from "eris";
import { CommandBase } from "../../CommandBase";
import { ActionRowConstructor, ButtonConstructor } from "../../../Classes";
import { words } from "../../../../constants";

const hang = (stage: number, word: string, guessed_letters: string[]) => {
	const word_placement = word
		.split("")
		.map((letter) => (guessed_letters.includes(letter) ? letter : " ? "))
		.join(" ");

	return `Hangman - Tries left: ${(stage - 4) / -1}
---------
|       ${stage > 0 ? "😙" : ""}
|       ${stage > 1 ? "👚" : ""}
|       ${stage > 2 ? "👖" : ""}
|       ${stage > 3 ? "👢" : ""}
|
|   ${word_placement}
--------------
`;
};

export = class Hangman extends CommandBase {
	public word: string;
	public correct: string[];
	public stage: number;

	constructor() {
		super("hangman", {
			description: "Play hangman!",
			category: "games",
			usage: "hangman",
			aliases: ["hm"],
			clientPermissions: ["embedLinks"],
			cooldown: 69
		});

		this.word = words[Math.floor(Math.random() * words.length)];
		this.correct = [];
		this.stage = 0;
	}

	public async execute(message: import("eris").Message, _args: string[]) {
		const letters = this.getLetters(this.word);
		const rows = new Array(3).fill(0).map(() => new ActionRowConstructor());
		const btns = new Array(15)
			.fill(0)
			.map((_, i) =>
				new ButtonConstructor(this.client)
					.setLabel(letters[i].toUpperCase())
					.setID(letters[i])
					.setCallback(this.cb, 60000, this, message.author.id)
			);

		for (let i = 0; i < 3; i++) rows[i].setComponents(btns.splice(0, 5));

		const embed = this.client.embeds
			.regular()
			.setTitle("Hangman! 🎮")
			.setDescription(hang(this.stage, this.word, this.correct))
			.setTimestamp();

		message.channel.createMessage({ components: rows, embed });
	}

	private async cb(interaction: ComponentInteraction, _: any, self: this, authorID: string) {
		if (!interaction.message.components) return;

		const letters = self.word.toLowerCase().split("");
		const letter = interaction.data.custom_id!.toLowerCase();

		if (letters.includes(letter) && !self.correct.includes(letter)) {
			const repeated = self.client.util.getRepeatedChar(self.word, letter);
			self.correct.push(...repeated);
		} else self.stage++;

		for (const row of interaction.message.components) {
			//@ts-expect-error
			for (const button of row.components) if (button.custom_id === letter) button.disabled = true;
		}
		let embed = self.client.embeds
			.regular()
			.setTitle(interaction.message.embeds[0].title!)
			.setDescription(hang(self.stage, self.word, self.correct))
			.setTimestamp();
		console.log(self.word);
		console.log(self.correct);
		if (self.word.split("").every((letter) => self.correct.includes(letter))) {
			const gained_points = 20 - self.stage * 5;

			embed = self.client.embeds
				.success()
				.setTitle(interaction.message.embeds[0].title!)
				.setDescription("You won!")
				.setFooter(`The word was ${self.word}, You gained ${gained_points} points!`)
				.setTimestamp();

			await self.client.addPoints(authorID, gained_points);

			return interaction.message.edit({ components: [], embed });
		}
		if (self.stage === 3) {
			self.stage = 0;
			self.correct = [];

			return interaction.message
				.edit({
					components: [],
					embed: self.client.embeds
						.error()
						.setTitle("Game Over!")
						.setDescription(`The word was ${self.word}`)
						.setTimestamp()
				})
				.then(() => (self.word = words[Math.floor(Math.random() * words.length)]));
		}

		interaction.acknowledge();

		interaction.message.edit({ components: interaction.message.components, embed });
	}

	private getLetters(word: string) {
		const letters = "abcdefghijklmnopqrstuvwxyz".split("");
		const word_letters = word.split("");

		for (let i = 0; i < 11; i++) {
			const random_num = Math.floor(Math.random() * letters.length);
			const random_letter = letters[random_num];
			if (!word_letters.includes(random_letter)) letters.splice(random_num, 1);
			else i--;
		}

		return letters;
	}
};
