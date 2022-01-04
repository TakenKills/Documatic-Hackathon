import { ComponentInteraction, Constants } from "eris";
import { EventBase } from "../EventBase";

export = class interactionCreate extends EventBase {
	constructor() {
		super({ name: "interactionCreate" });
	}

	public async execute(interaction: ComponentInteraction): Promise<void> {
		if (interaction.type !== Constants.InteractionTypes.MESSAGE_COMPONENT) return;

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

				setTimeout(() => {
					delete this.client.function_loop[interaction.data.custom_id];

					this.client.util.disableComponents(interaction);
				}, current.timeout);

				break;
			}
		}

		await current.function!(interaction, ...current.paramaters!);
	}
};
