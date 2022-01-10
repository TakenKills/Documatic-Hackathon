//@ts-expect-error
import Read from "readdir-recursive";
import { resolve } from "path";
import { Cache } from "./cache";
const { fileSync } = new Read();

export class Database {
	public models: Map<string, Cache>;

	constructor() {
		this.models = new Map();
		for (const model of fileSync(resolve("dist/Database/models"))) {
			const Model = require(model);
			this.models.set(Model.modelName, new Cache(Model.modelName, Model, new Map()));
		}
	}
}