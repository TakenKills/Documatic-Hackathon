"use strict";
const eris_1 = require("eris");
const CommandBase_1 = require("../../CommandBase");
const Classes_1 = require("../../../Classes");
class Game {
    constructor(players) {
        this.players = players;
        this.players = players;
        this.bot = !this.players[1] ? true : false;
        this.choices = [];
    }
    add_choice(choice, ID) {
        this.choices.push({ choice, ID });
        return this;
    }
}
module.exports = class RPS extends CommandBase_1.CommandBase {
    constructor() {
        super("rockpaperscissors", {
            description: "Play rock paper scissors with the bot!",
            category: "games",
            usage: "rps",
            aliases: ["rps"],
            clientPermissions: ["embedLinks"],
            cooldown: 15
        });
    }
    async execute(message, args) {
        const user = message.mentions.length > 0
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
        const btn = new Classes_1.ButtonConstructor(this.client)
            .setID(`rps_rock`)
            .setLabel("Rock")
            .setEmoji({ name: "✊" })
            .setCallback(this.cb, 15000, this, game);
        const btn2 = new Classes_1.ButtonConstructor(this.client)
            .setID(`rps_paper`)
            .setLabel("Paper")
            .setEmoji({ name: "✋" })
            .setCallback(this.cb, 15000, this, game);
        const btn3 = new Classes_1.ButtonConstructor(this.client)
            .setID(`rps_scissors`)
            .setLabel("Scissors")
            .setEmoji({ name: "✌️" })
            .setCallback(this.cb, 15000, this, game);
        const row = new Classes_1.ActionRowConstructor().setComponents([btn, btn2, btn3]);
        this.client.createMessage(message.channel.id, {
            components: [row],
            content: `${message.author.mention} Pick either \`rock\`, \`paper\`, or \`scissors\`.`
        });
    }
    async cb(interaction, self, game) {
        if (interaction.data.component_type !== eris_1.Constants.ComponentTypes.BUTTON)
            return;
        const clicker = interaction.member ? interaction.member : interaction.user;
        game.add_choice(interaction.data.custom_id.split("_")[1], clicker.id);
        if (game.choices.length > 1) {
            const winner = self.check_winner(game.choices[0], game.choices[1]);
            if (winner === "tie") {
                interaction.message.edit({ content: `${game.bot ? "We" : "You both"} Tied!`, components: [] });
            }
            else {
                const winner_user = game.players[winner];
                const loser_user = game.players[1 - winner];
                let description = `${winner_user ? (game.bot ? "You" : winner_user.mention) : "I"} won, unfortunate for ${loser_user ? `you ${loser_user.mention}` : "me."}.`;
                if (winner_user) {
                    const gain = 10;
                    description += `\n${winner_user.mention} gained ${gain}.`;
                    await self.client.addPoints(winner_user.id, gain);
                }
                interaction.message.edit({
                    content: description,
                    components: []
                });
            }
        }
        if (game.choices.length < 2)
            interaction.message.edit({ content: `${clicker.mention} has picked! you better hurry dude...` });
        interaction.acknowledge();
    }
    check_winner(player1, player2) {
        let winner = -1; // -1 = tie, 0 = player1, 1 = player2
        if (player1.choice === "rock" && player2.choice === "paper")
            winner = 1;
        else if (player1.choice === "rock" && player2.choice === "scissors")
            winner = 0;
        else if (player1.choice === "paper" && player2.choice === "rock")
            winner = 0;
        else if (player1.choice === "paper" && player2.choice === "scissors")
            winner = 1;
        else if (player1.choice === "scissors" && player2.choice === "rock")
            winner = 1;
        else if (player1.choice === "scissors" && player2.choice === "paper")
            winner = 0;
        else
            winner = -1;
        if (winner === -1)
            return "tie";
        else
            return winner;
    }
};
