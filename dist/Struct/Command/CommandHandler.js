"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const events_1 = require("events");
//@ts-expect-error
const readdir_recursive_1 = __importDefault(require("readdir-recursive"));
const path_1 = require("path");
const { fileSync } = new readdir_recursive_1.default();
class CommandHandler extends events_1.EventEmitter {
    constructor(client, prefix) {
        super();
        this.client = client;
        this.commands = new Map();
        this.aliases = new Map();
        this.cooldowns = new Map();
        this.prefix = prefix;
        this.client = client;
        this.categories = [];
        for (const dir of fileSync(path_1.resolve("dist/Struct/Command/commands")))
            this.create_command(dir);
    }
    create_command(dir) {
        const command = new (require(dir))(this.client);
        command.path = dir;
        command.client = this.client;
        this.commands.set(command.name, command);
        if (command.aliases.length > 0) {
            for (const alias of command.aliases)
                this.aliases.set(alias, command.name);
        }
        if (!this.categories.includes(command.category))
            this.categories.push(command.category);
    }
    async reload_command(commandName) {
        const command = this.commands.get(commandName);
        if (!command)
            return;
        try {
            delete require.cache[require.resolve(command.path)];
            this.commands.delete(command.name);
            this.create_command(command.path);
        }
        catch (e) {
            console.error("Error while reloading command:", e);
        }
    }
    async handle_message(message) {
        if (message.author.bot)
            return;
        const prefix = (await this.prefix(message.guildID)) || "$";
        if (!message.content.startsWith(prefix))
            return;
        const [command_name, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.commands.get(command_name.toLowerCase()) || this.commands.get(this.aliases.get(command_name.toLowerCase()));
        if (!command)
            return;
        if (command.guildOnly && message.channel.type !== 0)
            return;
        if (command.ownerOnly && !this.client.util.isOwner(message.author.id))
            return;
        //* Cooldowns.
        if (!this.cooldowns.has(command.name))
            this.cooldowns.set(command.name, new Map());
        const now = Date.now();
        const timestamps = this.cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return this.emit("cooldown", message, command, timeLeft);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        //* Cooldowns.
        //* Permissions.
        if (command.guildOnly) {
            const channel = message.channel;
            if (command.clientPermissions) {
                const perms = command.clientPermissions;
                let missing = [];
                for (const perm of perms) {
                    if (!channel.permissionsOf(this.client.user.id).has(perm))
                        missing.push(perm);
                }
                if (missing.length > 0)
                    return this.emit("missing_permissions", message, command, missing, "client");
            }
            if (command.memberPermissions) {
                const perms = command.memberPermissions;
                let missing = [];
                for (const perm of perms) {
                    if (!channel.permissionsOf(message.author.id).has(perm))
                        missing.push(perm);
                }
                if (missing.length > 0)
                    return this.emit("missing_permissions", message, command, missing, "client");
            }
        }
        //* Permissions.
        try {
            await command.execute(message, args);
            this.emit("commandUsed", message, command, args);
        }
        catch (e) {
            console.error(e);
            return message.channel.createMessage("An error occured while executing the command!");
        }
    }
}
exports.CommandHandler = CommandHandler;
