import { Client as ErisClient, ComponentInteraction, Message, User } from "eris";
import mongoose, { Document } from "mongoose";
import { Cache } from "./Database/cache";
import { Database } from "./Database/database";
import { Util, Embed } from "./Struct/Classes";
import { CommandHandler } from "./Struct/Command/CommandHandler";
import { EventHandler } from "./Struct/Event/EventHandler";
require("dotenv").config();

export type Config = { default_prefix: string; owners: string[] };

export class Client extends ErisClient {
	public readonly config: Config;
	public readonly util: Util;
	public readonly function_loop: Record<
		string,
		{
			function: (interaction: ComponentInteraction, ...args: any[]) => any;
			paramaters: any[];
			timeout: number;
			setTimeout?: NodeJS.Timeout;
		}
	>;

	public readonly games: { golf: boolean };

	public readonly db: Database;
	public readonly points: Cache;

	public readonly CommandHandler: CommandHandler;
	public readonly EventHandler: EventHandler;

	public readonly colors: { error: number; success: number; warning: number; theme: number };
	public readonly embeds: Record<"regular" | "success" | "error" | "warning", () => Embed>;

	constructor() {
		super(process.env.TOKEN!, {
			restMode: true,
			intents: ["guilds", "guildMembers", "guilds", "guildMessages", "directMessages"],
			allowedMentions: { everyone: false, repliedUser: false, roles: false, users: false }
		});

		this.db = new Database();
		this.points = this.db.models.get("User")!;

		this.function_loop = {};

		this.CommandHandler = new CommandHandler(this, () => "$");
		this.EventHandler = new EventHandler(this);

		this.config = { default_prefix: "$", owners: ["852600076168855612"] };
		this.util = new Util(this.config);

		this.colors = {
			error: 0xff0000,
			success: 0x00ff00,
			warning: 0xffa500,
			theme: 0x00ffff
		};

		this.embeds = {
			regular: () => new Embed().setColor(this.colors.theme),
			success: () => new Embed().setColor(this.colors.success),
			error: () => new Embed().setColor(this.colors.error),
			warning: () => new Embed().setColor(this.colors.warning)
		};

		this.games = {
			golf: false
		};

		this.on("messageCreate", (message: Message) => this.CommandHandler.handle_message(message));
		this.on("ready", () => console.log("Good to go."));
	}

	async addPoints(userID: string, points: number) {
		return await this.$inc(userID, { points });
	}

	async findUser(userID: string) {
		const user = (await this.points.findOne({ userID })) as Document;

		if (!user) return this.points.insertOne({ userID });

		return user;
	}

	async get_points(userID: string) {
		const user = await this.findUser(userID);

		return user.points;
	}

	async $inc(userID: string, data: Record<string, any>) {
		await this.findUser(userID);

		return await this.points.updateOne({ userID }, { $inc: data });
	}

	async _connect() {
		mongoose.connect(process.env.MONGO_URI!, {}, () => console.log("Successfully connected to the database."));

		mongoose.connection.on("disconnected", () => {
			console.log("The database has disconnected! reconnecting in 5 seconds!");

			setTimeout(() => this.connect(), 5000);
		});

		return await this.connect();
	}
}

Object.defineProperty(User.prototype, "tag", {
	get: function () {
		return `${this.username}#${this.discriminator}`;
	}
});

export const client = new Client();

client._connect();
