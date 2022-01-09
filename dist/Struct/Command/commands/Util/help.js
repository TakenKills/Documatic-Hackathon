"use strict";
const Classes_1 = require("../../../Classes");
const CommandBase_1 = require("../../CommandBase");
function filter(map, fn) {
    const results = new Map[Symbol.species]();
    for (const [key, val] of map) {
        if (fn(val))
            results.set(key, val);
    }
    return results;
}
function map(map, fn) {
    const results = [];
    for (const [, val] of map) {
        results.push(fn(val));
    }
    return results;
}
module.exports = class Help extends CommandBase_1.CommandBase {
    constructor() {
        super("help", {
            category: "Utility",
            description: "Get a list of commands or get help for a specific command.",
            usage: "help [command]",
            clientPermissions: ["embedLinks"]
        });
    }
    async execute(message, args) {
        var _a, _b;
        const row = new Classes_1.ActionRowConstructor();
        const commands = this.client.CommandHandler.commands;
        if (commands.get((_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
            const command = commands.get(args[0].toLowerCase());
            const embed = this.client.embeds
                .success()
                .setTitle(`Help for ${command.name}`)
                .setDescription(command.description)
                .addFields([
                {
                    name: "Usage",
                    value: `\`${command.usage}\``
                },
                {
                    name: "Aliases",
                    value: ((_b = command.aliases) === null || _b === void 0 ? void 0 : _b.length) ? command.aliases.join(", ") : "None"
                },
                {
                    name: "Category",
                    value: command.category
                }
            ])
                .setTimestamp();
            return this.client.createMessage(message.channel.id, { embed });
        }
        else {
            const button = new Classes_1.ButtonConstructor(this.client)
                .setLabel("Help")
                .setID("help_button")
                .setCallback(this.helpCB, 20000, this, row);
            row.addComponent(button);
            this.client.createMessage(message.channel.id, {
                content: "Press the button below to view the help menu!",
                components: [row]
            });
        }
    }
    helpCB(interaction, self, row) {
        interaction.message.components = [];
        row.components[0].disabled = true;
        const other_button = new Classes_1.ButtonConstructor(self.client)
            .setLabel("Help")
            .setID("help_button2")
            .setCallback(self.helpCB2, 20000, self);
        const new_row = new Classes_1.ActionRowConstructor().addComponents([row.components[0], other_button]);
        interaction.acknowledge();
        interaction.message.edit({ content: "Oops.. maybe try the other button?", components: [new_row] });
    }
    helpCB2(interaction, self) {
        interaction.message.components = [];
        const options = [];
        for (const category of self.client.CommandHandler.categories) {
            options.push({
                label: category,
                value: category.toLowerCase(),
                description: `View all commands in the ${category} category.`
            });
        }
        const selectMenu = new Classes_1.SelectMenuConstructor(self.client)
            .setID("help_menu")
            .setPlaceholder("Select a category to view")
            .setCallback(self.helpMenuCB, 30000, self)
            .setOptions(options);
        const new_row = new Classes_1.ActionRowConstructor().addComponent(selectMenu);
        interaction.acknowledge();
        interaction.message.edit({ content: "Dammit! try that menu then? maybe that'll work", components: [new_row] });
    }
    helpMenuCB(interaction, self) {
        const data = interaction.data;
        const category = data.values[0];
        const commands = filter(self.client.CommandHandler.commands, (command) => { var _a; return ((_a = command.category) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === category; });
        const embed = self.client.embeds
            .regular()
            .setTitle(`Commands in the ${category} category`)
            .setDescription(map(commands, (command) => `\`${command.name}\``).join(", "))
            .setTimestamp()
            .setFooter(`Requested by ${interaction.message.author.username}`, interaction.message.author.dynamicAvatarURL());
        interaction.acknowledge();
        interaction.message.edit({
            content: "Well, that worked. Pick a category you want to view! Beware, the menu closes in 20 seconds!",
            embed
        });
    }
};
