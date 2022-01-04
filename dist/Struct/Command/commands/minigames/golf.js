"use strict";
const Classes_1 = require("../../../Classes");
const CommandBase_1 = require("../../CommandBase");
const ROW_LENGTH = 11;
const ROW_NUMBER = 8;
// (ROW, INDEX)
const getLevelPlacements = (level) => {
    if (!level)
        return;
    // randomize the placement of the ball and hole
    const ballPlacement = [
        Math.floor(Math.random() * (ROW_NUMBER - 2)) + 1,
        Math.floor(Math.random() * (ROW_LENGTH - 2)) + 1
    ];
    const holePlacement = [
        Math.floor(Math.random() * (ROW_NUMBER - 1)) + 1,
        Math.floor(Math.random() * (ROW_LENGTH - 1)) + 1
    ];
    if (ballPlacement[1] === ROW_LENGTH - 1)
        ballPlacement[1]--;
    if (ballPlacement[1] < 0)
        ballPlacement[1] = 1;
    if (ballPlacement[0] === ROW_NUMBER)
        ballPlacement[0]--;
    if (holePlacement === ballPlacement)
        return getLevelPlacements(level);
    // make the player spawn right to the ball
    const playerPlacement = [ballPlacement[0], ballPlacement[1] - 1];
    return { playerPlacement, holePlacement, ballPlacement };
};
const generate_field = (Placements) => {
    const base = new Array(ROW_NUMBER).fill(0).map(() => new Array(ROW_LENGTH).fill(" ⚫ "));
    let playerPlacement = Placements === null || Placements === void 0 ? void 0 : Placements.playerPlacement;
    let holePlacement = Placements === null || Placements === void 0 ? void 0 : Placements.holePlacement;
    let ballPlacement = Placements === null || Placements === void 0 ? void 0 : Placements.ballPlacement;
    if (!playerPlacement)
        playerPlacement = [base.length - 2, 5];
    if (!holePlacement)
        holePlacement = [1, 5];
    if (!ballPlacement)
        ballPlacement = [playerPlacement[0] - 1, playerPlacement[1]];
    if (playerPlacement[0] === holePlacement[0] && playerPlacement[1] === holePlacement[1])
        playerPlacement[0]++;
    base[playerPlacement[0]][playerPlacement[1]] = "  👨‍🦲  ";
    base[holePlacement[0]][holePlacement[1]] = " 🌀 ";
    base[ballPlacement[0]][ballPlacement[1]] = " 🥎 ";
    const field = `${base.map((row) => row.join("")).join("\n")}`;
    return { base, placement: { playerPlacement, holePlacement, ballPlacement }, field };
};
module.exports = class Golf extends CommandBase_1.CommandBase {
    constructor() {
        super("golf", {
            category: "games",
            description: "Play a game of golf. that consists of 5 levels.",
            usage: "golf"
        });
        this.level = 1;
        this.frame = generate_field();
        this.field = this.frame.field;
        this.placement = this.frame.placement;
    }
    async execute(message, _, level) {
        this.level = level ? level : 0;
        this.frame = generate_field(level !== 0 ? getLevelPlacements(level) : undefined);
        this.field = this.frame.field;
        this.placement = this.frame.placement;
        const embed = this.client.embeds
            .regular()
            .setTitle("Golf!")
            .setDescription(this.field)
            .setFooter(this.placement.playerPlacement.join(", "));
        const btns = new Array(20).fill(0).map((_, i) => {
            var _a;
            return new Classes_1.ButtonConstructor(this.client)
                .setLabel("\u200b")
                .setID(`DISABLED_${(_a = message.guildID) !== null && _a !== void 0 ? _a : message.author.id}_${i}`)
                .setDisabled(true);
        });
        const ball_movement_btns = new Array(4).fill(0).map(() => new Classes_1.ButtonConstructor(this.client));
        ball_movement_btns[0].setLabel("⬅️").setID("left").setCallback(this.cb, 60000, this, message);
        ball_movement_btns[1].setLabel("➡️").setID("right").setCallback(this.cb, 60000, this, message);
        ball_movement_btns[2].setLabel("⬆️").setID("up").setCallback(this.cb, 60000, this, message);
        ball_movement_btns[3].setLabel("⬇️").setID("down").setCallback(this.cb, 60000, this, message);
        const player_movement_btns = new Array(4).fill(0).map(() => new Classes_1.ButtonConstructor(this.client));
        player_movement_btns[0].setLabel("👈").setID("leftP").setCallback(this.cb, 60000, this, message);
        player_movement_btns[1].setLabel("👉").setID("rightP").setCallback(this.cb, 60000, this, message);
        player_movement_btns[2].setLabel("👆").setID("upP").setCallback(this.cb, 60000, this, message);
        player_movement_btns[3].setLabel("👇").setID("downP").setCallback(this.cb, 60000, this, message);
        const rows = new Array(4).fill(0).map(() => new Classes_1.ActionRowConstructor().setComponents(btns.splice(0, 5)));
        rows[0].setComponent(ball_movement_btns[2], 2);
        rows[1].setComponent(ball_movement_btns[0], 1);
        rows[1].setComponent(ball_movement_btns[1], 3);
        rows[1].setComponent(ball_movement_btns[3], 2);
        rows[2].setComponent(player_movement_btns[2], 2);
        rows[3].setComponent(player_movement_btns[0], 1);
        rows[3].setComponent(player_movement_btns[1], 3);
        rows[3].setComponent(player_movement_btns[3], 2);
        return message.channel.createMessage({ embed, components: rows });
    }
    async cb(interaction, self, message) {
        var _a;
        if (((_a = interaction.user) === null || _a === void 0 ? void 0 : _a.id) !== message.author.id)
            return;
        const { custom_id: id } = interaction.data;
        const [rP, xP] = self.placement.playerPlacement;
        const [rB, xB] = self.placement.ballPlacement;
        // ball movement
        switch (id) {
            case "left":
                if (rB === rP && xB === xP - 1) {
                    let ballX = xB - 3;
                    if (ballX < 0)
                        ballX = 0;
                    self.placement.ballPlacement = [rB, ballX];
                    self.checkWin(self.placement, interaction, message);
                }
                else {
                    interaction.acknowledge();
                    return;
                }
                break;
            case "right":
                if (rB === rP && xB === xP + 1) {
                    let ballX = xB + 3;
                    if (ballX > ROW_LENGTH - 1)
                        ballX = ROW_LENGTH - 1;
                    self.placement.ballPlacement = [rB, ballX];
                    self.checkWin(self.placement, interaction, message);
                }
                else {
                    interaction.acknowledge();
                    return;
                }
            case "up":
                if (rP - rB === 1 && xB === xP && rP > 0) {
                    let ballR = rP - 3;
                    if (ballR < 0)
                        ballR = 0;
                    self.placement.ballPlacement = [ballR, xB];
                    self.checkWin(self.placement, interaction, message);
                }
                else {
                    interaction.acknowledge();
                    return;
                }
                break;
            case "down":
                if (rB === rP + 1 && xB === xP && rP < ROW_NUMBER - 1) {
                    let ballR = rP + 3;
                    if (ballR > ROW_NUMBER - 1)
                        ballR = ROW_NUMBER - 1;
                    self.placement.ballPlacement = [ballR, xB];
                    self.checkWin(self.placement, interaction, message);
                }
                else {
                    interaction.acknowledge();
                    return;
                }
                break;
        }
        // player movement
        switch (id) {
            case "leftP":
                if ((rP === rB && xP === xB - 1) || xP - 1 < 0) {
                    interaction.acknowledge();
                    return;
                }
                self.placement.playerPlacement = [rP, xP - 1];
                break;
            case "rightP":
                if ((rP === rB && xP === xB + 1) || xP + 1 > ROW_LENGTH - 1) {
                    interaction.acknowledge();
                    return;
                }
                self.placement.playerPlacement = [rP, xP + 1];
                break;
            case "upP":
                if ((rP - 1 === rB && xP === xB) || rP - 1 < 0) {
                    interaction.acknowledge();
                    return;
                }
                self.placement.playerPlacement = [rP - 1, xP];
                break;
            case "downP":
                if ((rP + 1 === rB && xP === xB) || rP + 1 > ROW_NUMBER - 1) {
                    interaction.acknowledge();
                    return;
                }
                self.placement.playerPlacement = [rP + 1, xP];
                break;
        }
        this.field = generate_field(self.placement).field;
        interaction.acknowledge();
        interaction.message.embeds[0].description = this.field;
        interaction.message.edit({ embed: interaction.message.embeds[0] });
    }
    checkWin(placement, interaction, message) {
        const [rB, xB] = placement.ballPlacement;
        const [rH, xH] = placement.holePlacement;
        const viable_spots = [
            [rH, xH],
            [rH - 1, xH],
            [rH + 1, xH],
            [rH, xH - 1],
            [rH, xH + 1],
            [rH - 1, xH - 1],
            [rH - 1, xH + 1],
            [rH + 1, xH - 1],
            [rH - 1, xH + 1] // down right
        ];
        let won = false;
        for (const [r, x] of viable_spots)
            if (r === rB && x === xB) {
                won = true;
                break;
            }
            else
                won = false;
        if (!won)
            return;
        const row = new Classes_1.ActionRowConstructor()
            .addComponent(new Classes_1.ButtonConstructor(this.client)
            .setLabel("End")
            .setID("End")
            .setStyle("DANGER")
            .setCallback(this.end, 15000, this, message))
            .addComponent(new Classes_1.ButtonConstructor(this.client)
            .setLabel("Next Level")
            .setID("next")
            .setCallback(this.nextLevel, 15000, this, message));
        interaction.message.edit({
            content: `Nice! You won!\nCurrent level: ${this.level}\npoints gained: ${this.level * 15}`,
            embeds: [],
            components: [row]
        });
    }
    nextLevel(interaction, self, message) {
        self.level++;
        interaction.message.delete();
        self.execute(message, [], self.level);
    }
    end(interaction, self, message) {
        interaction.message.delete();
        const gained_points = self.level * 15;
        self.client.addPoints(message.author.id, gained_points);
        const embed = self.client.embeds
            .success()
            .setTitle(`You've completed ${self.level} levels!`)
            .setDescription(`You've gained \`${gained_points}\` points!`)
            .setTimestamp()
            .setFooter(`Player: ${message.author.tag}`, message.author.dynamicAvatarURL());
        message.channel.createMessage({ embed });
    }
};
