import { Client } from "../../main";
import { Constants, Message } from "eris";

export abstract class CommandBase {
	public readonly description?: string;
	public readonly category?: string;
	public readonly usage?: string;
	public readonly aliases?: string[];
	public readonly guildOnly?: boolean;
	public readonly ownerOnly?: boolean;
	public readonly cooldown: number;
	public readonly clientPermissions: (keyof Constants["Permissions"])[];
	public readonly memberPermissions: (keyof Constants["Permissions"])[];

	public readonly client!: Client;
	public readonly path!: string;

	constructor(public readonly name: string, options: CommandOptions = {}) {
		this.name = name;

		this.aliases = options.aliases ?? [];
		this.guildOnly = options.guildOnly ?? false;
		this.ownerOnly = options.ownerOnly ?? false;
		this.description = options.description ?? "";
		this.category = options.category ?? "";
		this.usage = options.usage ?? "";

		this.cooldown = options.cooldown ?? 3;

		this.clientPermissions = options.clientPermissions ?? [];
		this.memberPermissions = options.memberPermissions ?? [];
	}

	public abstract execute(message: Message, args: string[], ...rest: any[]): Promise<void>;
}

export type CommandOptions = {
	description?: string;
	category?: string;
	usage?: string;
	aliases?: string[];
	guildOnly?: boolean;
	ownerOnly?: boolean;
	cooldown?: number;
	clientPermissions?: (keyof Constants["Permissions"])[];
	memberPermissions?: (keyof Constants["Permissions"])[];
};
