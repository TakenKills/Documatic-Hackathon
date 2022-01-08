"use strict";
const CommandBase_1 = require("../../CommandBase");
const Classes_1 = require("../../../Classes");
const constants_1 = require("../../../../constants");
const hang = (stage, word, guessed_letters) => {
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
class Game {
    constructor() {
        this.word = constants_1.words[Math.floor(Math.random() * constants_1.words.length)];
        this.correct = [];
        this.stage = 0;
    }
    add_correct(letters) {
        const to_add = Array.isArray(letters) ? letters : [letters];
        this.correct.push(...to_add);
        return this;
    }
    inc_stage() {
        this.stage++;
        return this;
    }
}
module.exports = class Hangman extends CommandBase_1.CommandBase {
    constructor() {
        super("hangman", {
            description: "Play hangman!",
            category: "games",
            usage: "hangman",
            aliases: ["hm"],
            clientPermissions: ["embedLinks"],
            cooldown: 69
        });
    }
    execute(message) {
        const game = new Game();
        const letters = this.getLetters(game.word);
        const rows = new Array(3).fill(0).map(() => new Classes_1.ActionRowConstructor());
        const btns = new Array(15)
            .fill(0)
            .map((_, i) => new Classes_1.ButtonConstructor(this.client)
            .setLabel(letters[i].toUpperCase())
            .setID(letters[i])
            .setCallback(this.cb, 120000, this, game, message.author.id));
        for (let i = 0; i < 3; i++)
            rows[i].setComponents(btns.splice(0, 5));
        const embed = this.client.embeds
            .regular()
            .setTitle("Hangman! 🎮")
            .setDescription(hang(game.stage, game.word, game.correct))
            .setTimestamp();
        this.client.createMessage(message.channel.id, { components: rows, embed });
    }
    async cb(interaction, self, game, authorID) {
        const letters = game.word.toLowerCase().split("");
        const letter = interaction.data.custom_id.toLowerCase();
        if (letters.includes(letter) && !game.correct.includes(letter)) {
            const repeated = self.client.util.getRepeatedChar(game.word, letter);
            game.add_correct(repeated);
        }
        else
            game.inc_stage();
        if (game.stage >= 4) {
            interaction.deferUpdate();
            return interaction.message.edit({
                components: [],
                embed: self.client.embeds
                    .error()
                    .setTitle("Game Over!")
                    .setDescription(`The word was ${game.word}`)
                    .setTimestamp()
            });
        }
        for (const row of interaction.message.components) {
            for (const button of row.components)
                if (button.custom_id === letter)
                    button.disabled = true;
        }
        let embed = self.client.embeds
            .regular()
            .setTitle(interaction.message.embeds[0].title)
            .setDescription(hang(game.stage, game.word, game.correct))
            .setTimestamp();
        if (game.word.split("").every((letter) => game.correct.includes(letter))) {
            const gained_points = 20 - game.stage * 5;
            embed = self.client.embeds
                .success()
                .setTitle(interaction.message.embeds[0].title)
                .setDescription("You won!")
                .setFooter(`The word was ${game.word}, You gained ${gained_points} points!`)
                .setTimestamp();
            await self.client.addPoints(authorID, gained_points);
            return interaction.message.edit({ components: [], embed });
        }
        interaction.acknowledge();
        return interaction.message.edit({ components: interaction.message.components, embed });
    }
    getLetters(word) {
        const letters = "abcdefghijklmnopqrstuvwxyz".split("");
        const word_letters = word.split("");
        for (let i = 0; i < 11; i++) {
            const random_num = Math.floor(Math.random() * letters.length);
            const random_letter = letters[random_num];
            if (!word_letters.includes(random_letter))
                letters.splice(random_num, 1);
            else
                i--;
        }
        return letters;
    }
};
