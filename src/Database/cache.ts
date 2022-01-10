import { EventEmitter } from "events";
import { Model, Types } from "mongoose";

type Document = Record<string, any>;

export class Cache extends EventEmitter {
	public readonly name: string;
	public readonly model: Model<any>;
	public readonly cache: Map<string, Document | Document[]>;

	constructor(name: string, model: Model<any>, cache: Map<string, Document | Document[]>) {
		super();

		this.name = name;
		this.model = model;
		this.cache = cache;

		this.on("clearCache", (key: string) => this.cache.delete(key));
	}

	public async findOne(query: Object): Promise<Document | void> {
		const doc = this.cache.get(`${Object.values(query)}_${this.name}`) as Document;

		if (!doc) {
			const data = await this.model.findOne(query);
			if (!data) return;

			this.cache.set(`${Object.values(query)}_${this.name}`, data);

			this.deleteCache(60, `${Object.values(query)}_${this.name}`);

			return data;
		} else return doc;
	}

	public async find(query: Object = {}): Promise<Document[]> {
		const data: Document[] = await this.model.find(query);
		if (data.length === 0) return [];

		this.cache.set(`${Object.values(query)}_${this.name}`, data);
		this.deleteCache(60, `${Object.values(query)}_${this.name}`);

		return data;
	}

	public async deleteOne(query: Object) {
		this.emit("clearCache", `${Object.values(query)}_${this.name}`);
		return this.model.deleteOne(query);
	}

	public async insertOne(document: Object): Promise<Document> {
		const doc = {
			_id: new Types.ObjectId(),
			...document
		};

		await new this.model(doc).save();
		return (await this.findOne(doc)) as Document;
	}

	public async updateOne(query: Object, update: Object) {
		await this.model.updateOne(query, update);

		this.deleteCache(0, `${Object.values(query)}_${this.name}`);

		const doc = await this.findOne(query);
		if (!doc) return;

		this.cache.set(`${Object.values(query)}_${this.name}`, doc);
		this.deleteCache(60, `${Object.values(query)}_${this.name}`);

		return doc;
	}

	private deleteCache(ttl: number, current: string): boolean {
		setTimeout(() => {
			this.cache.delete(current);
			return true;
		}, ttl * 1000);
		return true;
	}
}