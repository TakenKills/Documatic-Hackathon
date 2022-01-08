import { ComponentInteraction, ComponentInteractionSelectMenuData } from "eris";
import { ActionRowConstructor, ButtonConstructor, SelectMenuConstructor } from "../../../Classes";
import { CommandBase } from "../../CommandBase";

export = class Help extends CommandBase {
	public constructor() {
		super("help", {
			category: "Utility",
			description: "Get a list of commands or get help for a specific command.",
			usage: "help [command]",
			clientPermissions: ["embedLinks"]
		});
	}

	public async execute(message: import("eris").Message, _args: string[]): Promise<void> {
		const row = new ActionRowConstructor();

		const button = new ButtonConstructor(this.client)
			.setLabel("Help")
			.setID("help_button")
			.setCallback(this.helpCB, 12500, this, row);

		row.addComponent(button);

		this.client.createMessage(message.channel.id, {
			content: "Press the button below to view the help menu!",
			components: [row]
		});
	}

	public helpCB(interaction: ComponentInteraction, self: this, row: ActionRowConstructor): void {
		interaction.message.components = [];

		row.components[0].disabled = true;

		const other_button = new ButtonConstructor(self.client)
			.setLabel("Help")
			.setID("help_button2")
			.setCallback(self.helpCB2, 12500, self);

		const new_row = new ActionRowConstructor().addComponents([row.components[0], other_button]);

		interaction.acknowledge();

		interaction.message.edit({ content: "Oops.. maybe try the other button?", components: [new_row] });
	}

	public helpCB2(interaction: ComponentInteraction, self: this): void {
		interaction.message.components = [];

		const options = [];
		for (const category of self.client.CommandHandler.categories) {
			options.push({
				label: category,
				value: category.toLowerCase(),
				description: `View all commands in the ${category} category.`
			});
		}

		const selectMenu = new SelectMenuConstructor(self.client)
			.setID("help_menu")
			.setPlaceholder("Select a category to view")
			.setCallback(self.helpMenuCB, 20000, self)
			.setOptions(options);

		const new_row = new ActionRowConstructor().addComponent(selectMenu);

		interaction.acknowledge();

		interaction.message.edit({ content: "Dammit! try that menu then? maybe that'll work", components: [new_row] });
	}

	public helpMenuCB(interaction: ComponentInteraction, self: this): void {
		const data = interaction.data as ComponentInteractionSelectMenuData;
		const category = data.values[0];
		const commands = filter<string, CommandBase>(
			self.client.CommandHandler.commands,
			(command) => command.category?.toLowerCase() === category
		);

		const embed = self.client.embeds
			.regular()
			.setTitle(`Commands in the ${category} category`)
			.setDescription(map<string, CommandBase, string>(commands, (command) => `\`${command.name}\``).join(", "))
			.setTimestamp()
			.setFooter(`Requested by ${interaction.message.author.username}`, interaction.message.author.dynamicAvatarURL());

		interaction.acknowledge();

		interaction.message.edit({
			content: "Well, that worked. Pick a category you want to view! Beware, the menu closes in 20 seconds!",
			embed
		});
	}
};

function filter<K = any, V = any>(map: Map<K, V>, fn: (value: V) => boolean): Map<K, V> {
	const results = new Map[Symbol.species]() as Map<K, V>;
	for (const [key, val] of map) {
		if (fn(val)) results.set(key, val);
	}
	return results;
}

function map<K = any, V = any, R = any>(map: Map<K, V>, fn: (value: V) => R): R[] {
	const results: R[] = [];
	for (const [, val] of map) {
		results.push(fn(val));
	}
	return results;
}
