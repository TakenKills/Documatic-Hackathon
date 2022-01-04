import { GuildChannel, Message, TextableChannel } from "eris";
import { EventEmitter } from "events";
import { CommandBase } from "./CommandBase";
//@ts-expect-error
import Read from "readdir-recursive";
import { resolve } from "path";
import { Client } from "../../main";
const { fileSync } = new Read();

export class CommandHandler extends EventEmitter {
	public readonly commands: Map<string, CommandBase>;
	public readonly aliases: Map<string, string>;
	public readonly cooldowns: Map<string, Map<string, number>>;

	public readonly prefix: (guildID: string) => string | Promise<string>;
	public readonly categories: string[];

	constructor(public readonly client: Client, prefix: (guildID: string) => string) {
		super();
		this.commands = new Map<string, CommandBase>();
		this.aliases = new Map<string, string>();
		this.cooldowns = new Map<string, Map<string, number>>();

		this.prefix = prefix;
		this.client = client;
		this.categories = [];

		for (const dir of fileSync(resolve("dist/Struct/Command/commands"))) this.create_command(dir);
	}

	private create_command(dir: string) {
		const command = new (require(dir))(this.client);
		command.path = dir;
		command.client = this.client;

		this.commands.set(command.name, command);

		if (command.aliases.length > 0) {
			for (const alias of command.aliases) this.aliases.set(alias, command.name);
		}
		if (!this.categories.includes(command.category)) this.categories.push(command.category);
	}

	public async reload_command(commandName: string) {
		const command = this.commands.get(commandName);
		if (!command) return;

		try {
			delete require.cache[require.resolve(command.path)];

			this.commands.delete(command.name);

			this.create_command(command.path);
		} catch (e) {
			console.error("Error while reloading command:", e);
		}
	}

	public async handle_message(message: Message) {
		if (message.author.bot) return;

		const prefix = (await this.prefix(message.guildID!)) || "$";

		if (!message.content.startsWith(prefix)) return;

		const [command_name, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command =
			this.commands.get(command_name.toLowerCase()) || this.commands.get(this.aliases.get(command_name.toLowerCase())!);

		if (!command) return;

		if (command.guildOnly && message.channel.type !== 0) return;
		if (command.ownerOnly && !this.client.util.isOwner(message.author.id)) return;

		//* Cooldowns.

		if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Map());

		const now = Date.now();
		const timestamps = this.cooldowns.get(command.name)!;

		const cooldownAmount = command.cooldown! * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				console.log("heoooo");
				return this.emit("cooldown", message, command, timeLeft);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		//* Cooldowns.

		//* Permissions.

		if (command.guildOnly) {
			const channel = message.channel as TextableChannel & GuildChannel;
			if (command.clientPermissions) {
				const perms = command.clientPermissions;

				let missing = [];

				for (const perm of perms) {
					if (!channel.permissionsOf(this.client.user.id).has(perm)) missing.push(perm);
				}

				if (missing.length > 0) return this.emit("missing_permissions", message, command, missing, "client");
			}

			if (command.memberPermissions) {
				const perms = command.memberPermissions;

				let missing = [];

				for (const perm of perms) {
					if (!channel.permissionsOf(message.author.id).has(perm)) missing.push(perm);
				}

				if (missing.length > 0) return this.emit("missing_permissions", message, command, missing, "client");
			}
		}

		//* Permissions.

		try {
			await command.execute!(message, args);

			this.emit("commandUsed", message, command, args);
		} catch (e) {
			console.error(e);
			return message.channel.createMessage("An error occured while executing the command!");
		}
	}
}
