import { Client } from "../../main";

export abstract class EventBase {
	public readonly name: string;
	public readonly once?: boolean;
	public readonly emitter?: string;

	public path!: string;
	public client!: Client;

	constructor(obj: EventOptions) {
		this.name = obj.name;
		this.once = obj.once ?? false;
		this.emitter = obj.emitter || "client";
	}

	public abstract execute(...args: any[]): void | Promise<void>;
}

export type EventOptions = {
	name: string;
	once?: boolean;
	emitter?: string;
};
