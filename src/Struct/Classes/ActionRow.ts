import { Constants, ActionRowComponents, ActionRow } from "eris";

export class ActionRowConstructor implements ActionRow {
	public components: ActionRowComponents[];
	public type: Constants["ComponentTypes"]["ACTION_ROW"];

	constructor() {
		this.type = 1;
		this.components = [];
	}

	public setComponents(components: ActionRowComponents[]): this {
		this.components = components;
		return this;
	}

	public setComponent(component: ActionRowComponents, index: number): this {
		this.components[index] = component;
		return this;
	}

	public addComponent(component: ActionRowComponents): this {
		this.components.push(component);
		return this;
	}

	public addComponents(components: ActionRowComponents[]): this {
		this.components.push(...components);
		return this;
	}
}
