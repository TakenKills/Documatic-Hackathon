import { Constants, SelectMenu, SelectMenuOptions } from "eris";
import { Client } from "../../main";

export class SelectMenuConstructor implements SelectMenu {
	public custom_id: string;
	public disabled?: boolean;
	public max_values?: number;
	public min_values?: number;
	public options: SelectMenuOptions[];
	public placeholder?: string;
	public type: Constants["ComponentTypes"]["SELECT_MENU"];

	constructor(public readonly client: Client) {
		this.type = 3;
		this.disabled = false;
		this.custom_id = "";
		this.max_values = 1;
		this.min_values = 1;
		this.options = [];
		this.placeholder = "";

		this.client = client;
	}

	public setDisabled(disabled: boolean): this {
		this.disabled = disabled;
		return this;
	}

	public setMaxValues(max_values: number): this {
		this.max_values = max_values;
		return this;
	}

	public setMinValues(min_values: number): this {
		this.min_values = min_values;
		return this;
	}

	public setPlaceholder(placeholder: string): this {
		this.placeholder = placeholder;
		return this;
	}

	public addOption(option: SelectMenuOptions): this {
		this.options.push(option);
		return this;
	}

	public addOptions(options: SelectMenuOptions[]): this {
		this.options.push(...options);
		return this;
	}

	public setOptions(options: SelectMenuOptions[]): this {
		this.options = options;
		return this;
	}

	public setID(custom_id: string): this {
		this.custom_id = custom_id;
		return this;
	}

	public setCallback(callback: (...args: any[]) => any, timeout: number, ...rest: any[]): this {
		this.client.function_loop[this.custom_id] = { function: callback, paramaters: rest, timeout };

		return this;
	}
}
