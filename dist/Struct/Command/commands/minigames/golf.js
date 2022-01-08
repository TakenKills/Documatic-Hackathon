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
class Course {
    constructor(level) {
        this.level = level ? level : 0;
        this.field = this.generate_field(this.level > 0 ? getLevelPlacements(this.level) : undefined);
        this.frame = this.field.frame;
        this.placements = this.field.placement;
    }
    generate_field(Placements) {
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
        const frame = `${base.map((row) => row.join("")).join("\n")}`;
        return { base, placement: { playerPlacement, holePlacement, ballPlacement }, frame };
    }
    edit_ball(placement) {
        this.field.placement.ballPlacement = placement;
        this.placements = this.field.placement;
        return this;
    }
    edit_player(placement) {
        this.field.placement.playerPlacement = placement;
        this.placements = this.field.placement;
        return this;
    }
    next_level() {
        this.level++;
        return this.update(this.level);
    }
    update(level) {
        this.field = this.generate_field(level ? getLevelPlacements(level) : this.placements);
        this.frame = this.field.frame;
        this.placements = this.field.placement;
        return this;
    }
}
module.exports = class Golf extends CommandBase_1.CommandBase {
    constructor() {
        super("golf", {
            category: "games",
            description: "Play a game of golf, that consists of infinite levels!",
            usage: "golf",
            cooldown: 69
        });
    }
    execute(message, _, level) {
        const course = new Course(level);
        const embed = this.client.embeds.regular().setTitle("Golf!").setDescription(course.frame).setTimestamp();
        const btns = new Array(20).fill(0).map((_, i) => {
            var _a;
            return new Classes_1.ButtonConstructor(this.client)
                .setLabel("\u200b")
                .setID(`DISABLED_${(_a = message.guildID) !== null && _a !== void 0 ? _a : message.author.id}_${i}`)
                .setDisabled(true);
        });
        const ball_movement_btns = new Array(4).fill(0).map(() => new Classes_1.ButtonConstructor(this.client));
        ball_movement_btns[0].setLabel("⬅️").setID("left").setCallback(this.cb, 60000, this, message, course);
        ball_movement_btns[1].setLabel("➡️").setID("right").setCallback(this.cb, 60000, this, message, course);
        ball_movement_btns[2].setLabel("⬆️").setID("up").setCallback(this.cb, 60000, this, message, course);
        ball_movement_btns[3].setLabel("⬇️").setID("down").setCallback(this.cb, 60000, this, message, course);
        const player_movement_btns = new Array(4).fill(0).map(() => new Classes_1.ButtonConstructor(this.client));
        player_movement_btns[0].setLabel("👈").setID("leftP").setCallback(this.cb, 60000, this, message, course);
        player_movement_btns[1].setLabel("👉").setID("rightP").setCallback(this.cb, 60000, this, message, course);
        player_movement_btns[2].setLabel("👆").setID("upP").setCallback(this.cb, 60000, this, message, course);
        player_movement_btns[3].setLabel("👇").setID("downP").setCallback(this.cb, 60000, this, message, course);
        const rows = new Array(4).fill(0).map(() => new Classes_1.ActionRowConstructor().setComponents(btns.splice(0, 5)));
        rows[0].setComponent(ball_movement_btns[2], 2);
        rows[1].setComponent(ball_movement_btns[0], 1);
        rows[1].setComponent(ball_movement_btns[1], 3);
        rows[1].setComponent(ball_movement_btns[3], 2);
        rows[2].setComponent(player_movement_btns[2], 2);
        rows[3].setComponent(player_movement_btns[0], 1);
        rows[3].setComponent(player_movement_btns[1], 3);
        rows[3].setComponent(player_movement_btns[3], 2);
        this.client.createMessage(message.channel.id, { embed, components: rows });
    }
    async cb(interaction, self, message, course) {
        var _a;
        if (((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.id) !== message.author.id)
            return;
        const { custom_id: id } = interaction.data;
        const [rP, xP] = course.placements.playerPlacement;
        const [rB, xB] = course.placements.ballPlacement;
        // ball movement
        switch (id) {
            case "left":
                if (rB === rP && xB === xP - 1) {
                    let ballX = xB - 3;
                    if (ballX < 0)
                        ballX = 0;
                    course.edit_ball([rB, ballX]);
                    self.checkWin(interaction, message, course);
                }
                else {
                    return interaction.acknowledge();
                }
                break;
            case "right":
                if (rB === rP && xB === xP + 1) {
                    let ballX = xB + 3;
                    if (ballX > ROW_LENGTH - 1)
                        ballX = ROW_LENGTH - 1;
                    course.edit_ball([rB, ballX]);
                    self.checkWin(interaction, message, course);
                }
                else {
                    return interaction.acknowledge();
                }
            case "up":
                if (rP - rB === 1 && xB === xP && rP > 0) {
                    let ballR = rP - 3;
                    if (ballR < 0)
                        ballR = 0;
                    course.edit_ball([ballR, xB]);
                    self.checkWin(interaction, message, course);
                }
                else {
                    return interaction.acknowledge();
                }
                break;
            case "down":
                if (rB === rP + 1 && xB === xP && rP < ROW_NUMBER - 1) {
                    let ballR = rP + 3;
                    if (ballR > ROW_NUMBER - 1)
                        ballR = ROW_NUMBER - 1;
                    course.edit_ball([ballR, xB]);
                    self.checkWin(interaction, message, course);
                }
                else {
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
    checkWin(interaction, message, course) {
        const [rB, xB] = course.placements.ballPlacement;
        const [rH, xH] = course.placements.holePlacement;
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
            .setCallback(this.end, 15000, this, message, course))
            .addComponent(new Classes_1.ButtonConstructor(this.client)
            .setLabel("Next Level")
            .setID("next")
            .setCallback(this.nextLevel, 15000, this, message, course));
        interaction.message.edit({
            content: `Nice! You won!\nCurrent level: ${course.level}\npoints gained: ${course.level * 15}`,
            embeds: [],
            components: [row]
        });
    }
    nextLevel(interaction, self, message, course) {
        course.next_level();
        interaction.message.delete();
        self.execute(message, [], course.level);
    }
    end(interaction, self, message, course) {
        interaction.message.delete();
        const gained_points = course.level * 15;
        self.client.addPoints(message.author.id, gained_points);
        const embed = self.client.embeds
            .success()
            .setTitle(`You've completed ${course.level} levels!`)
            .setDescription(`You've gained \`${gained_points}\` points!`)
            .setTimestamp()
            .setFooter(`Player: ${message.author.tag}`, message.author.dynamicAvatarURL());
        this.client.createMessage(message.channel.id, { embed });
    }
};
