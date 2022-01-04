import { Button, Constants, InteractionButton, PartialEmoji, URLButton } from "eris";
import { Client } from "../../main";

type ButtonStyle<T extends InteractionButton | URLButton> = T["style"];

export class ButtonConstructor<T extends Button = InteractionButton> {
	public disabled?: boolean;
	public emoji?: Partial<PartialEmoji>;
	public label?: string;
	public custom_id: string;
	public type: Constants["ComponentTypes"]["BUTTON"] = 2;
	public style: ButtonStyle<T>;

	constructor(public readonly client: Client) {
		this.disabled = false;
		this.emoji = {};
		this.label = "";
		this.custom_id = "";
		this.style = Constants.ButtonStyles.PRIMARY;

		this.client = client;
	}

	public setID(custom_id: string): this {
		this.custom_id = custom_id;
		return this;
	}

	public setDisabled(disabled: boolean): this {
		this.disabled = disabled;
		return this;
	}

	public setEmoji(emoji: Partial<PartialEmoji>): this {
		this.emoji = emoji;
		return this;
	}

	public setLabel(label: string): this {
		this.label = label;
		return this;
	}

	public setStyle(style: keyof Constants["ButtonStyles"]): this {
		this.style = Constants.ButtonStyles[style];
		return this;
	}

	public setCallback(callback: (...args: any[]) => any, timeout: number, ...rest: any[]): this {
		this.client.function_loop[this.custom_id] = { function: callback, paramaters: rest, timeout };

		return this;
	}
}
