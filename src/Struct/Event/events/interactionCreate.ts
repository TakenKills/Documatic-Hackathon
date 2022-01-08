import { CommandInteraction, ComponentInteraction } from "eris";
import { EventBase } from "../EventBase";

export = class interactionCreate extends EventBase {
	constructor() {
		super({ name: "interactionCreate" });
	}

	public async execute(interact: ComponentInteraction | CommandInteraction): Promise<void> {
		if (interact instanceof ComponentInteraction) {
			const interaction = interact as ComponentInteraction;

			const queue = this.client.function_loop;
			let current: { function: Function; paramaters: Array<any>; timeout: number; setTimeout?: NodeJS.Timeout } = {
				function: () => void 0,
				paramaters: [],
				timeout: 0
			};

			for (const [key, value] of Object.entries(queue)) {
				if (key === interaction.data.custom_id) {
					current.function = value.function;
					current.paramaters = value.paramaters;
					current.timeout = value.timeout;

					if (current.setTimeout) clearTimeout(current.setTimeout);

					current.setTimeout = setTimeout(() => {
						if (!this.client.function_loop[interaction.data.custom_id]) return;

						delete this.client.function_loop[interaction.data.custom_id];

						this.client.util.disableComponents(interaction);
					}, current.timeout);

					break;
				}
			}

			await current.function!(interaction, ...current.paramaters!);
		}
	}
};
