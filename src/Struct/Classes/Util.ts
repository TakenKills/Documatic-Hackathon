import { ComponentInteraction } from "eris";
import { Config } from "../../main";

export class Util {
	constructor(public readonly config: Config) {
		this.config = config;
	}

	public randomINT(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public randomBool() {
		return Math.random() >= 0.5;
	}

	public shuffle<T>(array: T[]): T[] {
		let currentIndex = array.length,
			temporaryValue,
			randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	public randomElem<T>(array: T[]): T {
		return array[Math.floor(Math.random() * array.length)];
	}

	public isOwner(id: string): boolean {
		return this.config.owners.includes(id);
	}

	public setKV(obj: Record<string, any>, key: string, value: any) {
		obj[key] = value;
	}

	public getKey(obj: Record<string, any>, key: string) {
		return obj[key];
	}

	public deleteKey(obj: Record<string, any>, key: string) {
		delete obj[key];
	}

	public getRepeatedChar(str: string, char: string) {
		const chars = {} as Record<string, number>;
		for (const _ of str) {
			chars[char] = (chars[char] || 0) + 1;
		}
		return Object.entries(chars)
			.filter((char) => char[1] > 1)
			.map((char) => char[0]);
	}

	public disableComponents(interaction: ComponentInteraction): void {
		if (interaction.message.components && interaction.message.components.length > 0)
			for (const ActionRow of interaction.message.components) {
				for (const component of ActionRow.components) {
					component.disabled = true;
				}
			}

		interaction.message.edit({ components: interaction.message.components }).catch((e) => e);
	}
}
