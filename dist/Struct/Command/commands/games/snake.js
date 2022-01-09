"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = __importDefault(require("events"));
const Classes_1 = require("../../../Classes");
const CommandBase_1 = require("../../CommandBase");
var Blocks;
(function (Blocks) {
    Blocks[Blocks["EMPTY"] = 0] = "EMPTY";
    Blocks[Blocks["SNAKE_BODY"] = 1] = "SNAKE_BODY";
    Blocks[Blocks["FOOD"] = 2] = "FOOD";
})(Blocks || (Blocks = {}));
class Game extends events_1.default {
    constructor() {
        super();
        this.last_input = { x: 1, y: 0 };
        this.game_start = Date.now();
        this.table = new Array(11).fill(0).map(() => new Array(17).fill(Blocks.EMPTY));
        this.snake_body = [
            { x: 7, y: 5 },
            { x: 6, y: 5 }
        ];
        this.set_snake();
        this.spawn_food();
    }
    get_input_direction(input) {
        let input_direction;
        switch (input) {
            case "UP":
                if (this.last_input.y !== 0)
                    return;
                input_direction = { x: 0, y: -1 };
                break;
            case "DOWN":
                if (this.last_input.y !== 0)
                    return;
                input_direction = { x: 0, y: 1 };
                break;
            case "LEFT":
                if (this.last_input.x !== 0)
                    return;
                input_direction = { x: -1, y: 0 };
                break;
            case "RIGHT":
                if (this.last_input.x !== 0)
                    return;
                input_direction = { x: 1, y: 0 };
                break;
            default:
                input_direction = { x: 0, y: 0 };
        }
        this.last_input = input_direction;
        return input_direction;
    }
    update(input, segment) {
        let input_direction = segment ? segment : this.get_input_direction(input);
        if (!input_direction)
            return;
        const newX = this.snake_body[0].x + input_direction.x;
        const newY = this.snake_body[0].y + input_direction.y;
        if (newX < 0 || newX > this.table[0].length - 1 || newY < 0 || newY > this.table.length - 1)
            return this.end_game(0);
        for (let i = this.snake_body.length - 2; i >= 0; i--)
            this.snake_body[i + 1] = Object.assign({}, this.snake_body[i]);
        if (this.table[newY][newX] === Blocks.FOOD)
            this.eat_food();
        this.snake_body[0] = { x: newX, y: newY };
        this.set_snake();
    }
    end_game(state) {
        clearInterval(this.loop);
        if (state)
            return this.emit("end", state);
        else
            return;
    }
    move_snake() {
        return this.update(null, this.last_input);
    }
    set_snake() {
        for (let row = 0; row < this.table.length; row++) {
            for (let column = 0; column < this.table[row].length; column++) {
                if (this.table[row][column] === Blocks.SNAKE_BODY)
                    this.table[row][column] = Blocks.EMPTY;
            }
        }
        for (const segment of this.snake_body) {
            this.table[segment.y][segment.x] = Blocks.SNAKE_BODY;
        }
    }
    spawn_food() {
        const x = Math.floor(Math.random() * this.table[0].length);
        const y = Math.floor(Math.random() * this.table.length);
        if (this.table[y][x] === Blocks.SNAKE_BODY)
            this.spawn_food();
        this.table[y][x] = Blocks.FOOD;
    }
    eat_food() {
        this.spawn_food();
        this.snake_body[this.snake_body.length] = Object.assign({}, this.snake_body[this.snake_body.length - 1]);
        this.set_snake();
        if (this.snake_body.length >= 15)
            this.end_game(1);
    }
    game_loop() {
        this.loop = setInterval(() => {
            if (this.game_start + 300000 < Date.now())
                return this.end_game(2);
            this.move_snake();
            this.emit("update");
        }, 1666.66666667);
    }
    get preview() {
        return this.table
            .map((row) => row
            .map((block) => {
            switch (block) {
                case Blocks.EMPTY:
                    return "⬛";
                case Blocks.SNAKE_BODY:
                    return "🟩";
                case Blocks.FOOD:
                    return "🟡";
            }
        })
            .join(""))
            .join("\n");
    }
}
module.exports = class Snake extends CommandBase_1.CommandBase {
    constructor() {
        super("snake", {
            description: "Play a game of snake!",
            category: "games",
            usage: "snake",
            clientPermissions: ["embedLinks"],
            aliases: ["sn"],
            cooldown: 30
        });
    }
    async execute(message) {
        const btns = new Array(15)
            .fill(0)
            .map((_, i) => new Classes_1.ButtonConstructor(this.client)
            .setLabel("\u200b")
            .setID(`DISABLED_${message.author.id}_${i}`)
            .setDisabled(true));
        const game = new Game();
        const movement_buttons = new Array(4).fill(0).map(() => new Classes_1.ButtonConstructor(this.client));
        movement_buttons[0].setLabel("⬅️").setID("LEFT").setCallback(this.cb, 300000, game);
        movement_buttons[1].setLabel("➡️").setID("RIGHT").setCallback(this.cb, 300000, game);
        movement_buttons[2].setLabel("⬆️").setID("UP").setCallback(this.cb, 300000, game);
        movement_buttons[3].setLabel("⬇️").setID("DOWN").setCallback(this.cb, 300000, game);
        const rows = new Array(3).fill(0).map(() => new Classes_1.ActionRowConstructor().setComponents(btns.splice(0, 5)));
        rows[0].setComponent(movement_buttons[2], 2);
        rows[1].setComponent(movement_buttons[0], 1);
        rows[1].setComponent(movement_buttons[1], 3);
        rows[2].setComponent(movement_buttons[3], 2);
        const exit = new Classes_1.ButtonConstructor(this.client)
            .setLabel("EXIT")
            .setID("EXIT")
            .setStyle("DANGER")
            .setCallback(this.cb, 300000, game);
        rows[2].setComponent(exit, 4);
        const embed = this.client.embeds
            .regular()
            .setTitle("Snake!")
            .setDescription(game.preview)
            .setFooter("Use the buttons below to play! You have 5 minutes to play!")
            .setTimestamp();
        const gameMessage = await this.client.createMessage(message.channel.id, { embed, components: rows });
        game.game_loop();
        game.on("end", async (state) => {
            if (state === 0) {
                return this.client.editMessage(message.channel.id, gameMessage.id, {
                    embeds: [],
                    components: [],
                    content: "Damn man.. your snake's dead... :("
                });
            }
            else if (state === 1) {
                await this.client.editMessage(message.channel.id, gameMessage.id, {
                    embeds: [],
                    components: [],
                    content: "Your snake reached the length of 15 and won the game! You've received 50 points!"
                });
                await this.client.addPoints(message.author.id, 50);
            }
            else if (state === 2) {
                await this.client.editMessage(message.channel.id, gameMessage.id, {
                    embeds: [],
                    components: [],
                    content: "Your snake ran out of time! You've received 20 points!"
                });
                await this.client.addPoints(message.author.id, 20);
            }
        });
        game.on("update", () => {
            gameMessage.embeds[0].description = game.preview;
            const embed = gameMessage.embeds[0];
            this.client.editMessage(message.channel.id, gameMessage.id, { embed });
        });
    }
    async cb(interaction, game) {
        if (interaction.data.custom_id === "EXIT") {
            game.end_game();
            await interaction.deferUpdate();
            return interaction.editMessage(interaction.message.id, { embeds: [], components: [], content: "Okay." });
        }
        const direction = interaction.data.custom_id;
        game.update(direction);
        interaction.message.embeds[0].description = game.preview;
        await interaction.deferUpdate();
        interaction.editMessage(interaction.message.id, {
            embeds: interaction.message.embeds
        });
    }
};
