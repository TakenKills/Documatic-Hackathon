"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.Client = void 0;
const eris_1 = require("eris");
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./Database/database");
const Classes_1 = require("./Struct/Classes");
const CommandHandler_1 = require("./Struct/Command/CommandHandler");
const EventHandler_1 = require("./Struct/Event/EventHandler");
const constants_1 = require("./constants");
require("dotenv").config();
class Client extends eris_1.Client {
    constructor() {
        super(process.env.TOKEN, {
            restMode: true,
            intents: ["guilds", "guildMembers", "guilds", "guildMessages", "directMessages"],
            allowedMentions: { everyone: false, repliedUser: false, roles: false, users: false }
        });
        this.db = new database_1.Database();
        this.points = this.db.models.get("User");
        this.function_loop = {};
        this.CommandHandler = new CommandHandler_1.CommandHandler(this, () => "$");
        this.EventHandler = new EventHandler_1.EventHandler(this);
        this.config = { default_prefix: "$", owners: ["852600076168855612"] };
        this.util = new Classes_1.Util(this);
        this.colors = {
            error: 0xff0000,
            success: 0x00ff00,
            warning: 0xffa500,
            theme: 0x00ffff
        };
        this.embeds = {
            regular: () => new Classes_1.Embed().setColor(this.colors.theme),
            success: () => new Classes_1.Embed().setColor(this.colors.success),
            error: () => new Classes_1.Embed().setColor(this.colors.error),
            warning: () => new Classes_1.Embed().setColor(this.colors.warning)
        };
        this.on("messageCreate", (message) => this.CommandHandler.handle_message(message));
        this.on("ready", () => console.log("Good to go."));
    }
    async addPoints(userID, points) {
        return await this.$inc(userID, { points });
    }
    async findUser(userID) {
        const user = (await this.points.findOne({ userID }));
        if (!user)
            return this.points.insertOne({ userID });
        return user;
    }
    async get_points(userID) {
        const user = await this.findUser(userID);
        return user.points;
    }
    async $inc(userID, data) {
        await this.findUser(userID);
        return await this.points.updateOne({ userID }, { $inc: data });
    }
    async _connect() {
        mongoose_1.default.connect(process.env.MONGO_URI, {}, () => console.log("Successfully connected to the database."));
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("The database has disconnected! reconnecting in 5 seconds!");
            setTimeout(() => this.connect(), 5000);
        });
        return await this.connect();
    }
}
exports.Client = Client;
constants_1.DEFINE_PROPERTIES();
exports.client = new Client();
exports.client._connect();
