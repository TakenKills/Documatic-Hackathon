"use strict";
const eris_1 = require("eris");
const CommandBase_1 = require("../../CommandBase");
const Classes_1 = require("../../../Classes");
module.exports = class rps extends CommandBase_1.CommandBase {
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
    async execute(message, _args) {
        const btn = new Classes_1.ButtonConstructor(this.client).setID(`rps_rock`).setLabel("Rock").setEmoji({ name: "✊" });
        const btn2 = new Classes_1.ButtonConstructor(this.client).setID(`rps_paper`).setLabel("Paper").setEmoji({ name: "✋" });
        const btn3 = new Classes_1.ButtonConstructor(this.client).setID(`rps_scissors`).setLabel("Scissors").setEmoji({ name: "✌️" });
        const row = new Classes_1.ActionRowConstructor().setComponents([btn, btn2, btn3]);
        btn.setCallback(this.cb, 15000, this, message.author.id);
        btn2.setCallback(this.cb, 15000, this, message.author.id);
        btn3.setCallback(this.cb, 15000, this, message.author.id);
        message.channel.createMessage({ components: [row], content: "Pick either `rock`, `paper`, or `scissors`." });
    }
    async cb(interaction, client, authorID) {
        if (interaction.data.component_type !== eris_1.Constants.ComponentTypes.BUTTON)
            return;
        const choices = ["rock", "paper", "scissors"];
        const choice = choices[client.util.randomINT(0, choices.length)];
        let winner = -1; // 0 = tie, 1 = bot, 2 = user
        const opponent = interaction.data.custom_id.slice(4);
        if (choice === "rock" && opponent === "paper")
            winner = 2;
        else if (choice === "rock" && opponent === "scissors")
            winner = 1;
        else if (choice === "paper" && opponent === "rock")
            winner = 1;
        else if (choice === "paper" && opponent === "scissors")
            winner = 2;
        else if (choice === "scissors" && opponent === "rock")
            winner = 2;
        else if (choice === "scissors" && opponent === "paper")
            winner = 1;
        else
            winner = 0;
        const gain = winner === 1 ? 0 : winner === 2 ? 10 : 5;
        const embed = client.embeds[winner === 2 ? "success" : winner === 1 ? "error" : "warning"]()
            .setTitle(`${interaction.data.custom_id.slice(4)} vs ${choice}`)
            .setDescription(`${winner === 2 ? "You won!" : winner === 1 ? "I won!" : "It's a Tie!"}`)
            .setFooter(`You gained ${gain} points!`)
            .setTimestamp();
        interaction.message.edit({ embeds: [embed], components: [], content: "" });
        await client.addPoints(authorID, gain);
    }
};
