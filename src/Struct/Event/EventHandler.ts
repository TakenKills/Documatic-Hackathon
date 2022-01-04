import { EventEmitter } from "events";
import { Client } from "../../main";
import { EventBase } from "./EventBase";
//@ts-expect-error
import Read from "readdir-recursive";
import { resolve } from "path";
const { fileSync } = new Read();

export class EventHandler extends EventEmitter {
	public readonly events: Map<string, EventBase>;

	constructor(public readonly client: Client) {
		super();
		this.client = client;

		this.events = new Map();

		for (const dir of fileSync(resolve("dist/Struct/Event/events"))) this.register_event(dir);
	}

	public register_event(event_path: string) {
		const event: EventBase = new (require(event_path))(this.client);

		event.path = event_path;
		event.client = this.client;

		this.events.set(event.name, event);

		if (event.emitter == "client")
			this.client[event.once ? "once" : "on"](event.name, async (...args: any[]) => await event.execute(...args));
		else
			this.client.CommandHandler[event.once ? "once" : "on"](
				event.name,
				async (...args: any[]) => await event.execute(...args)
			);
	}
}
