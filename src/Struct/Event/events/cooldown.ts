import { EventBase } from "../EventBase";
import { Message } from "eris";
import { CommandBase as Command } from "../../Command/CommandBase";

function HumanTime(sec: number) {
	const hours = Math.floor(sec / 3600);
	const minutes = Math.floor((sec - hours * 3600) / 60);
	const seconds = sec - hours * 3600 - minutes * 60;

	let time = "";
	if (hours > 0) {
		time += `${hours} hour${hours > 1 ? "s" : ""}`;
	}
	if (minutes > 0) {
		if (time !== "") time += ", ";
		time += `${minutes} minute${minutes > 1 ? "s" : ""}`;
	}
	if (seconds > 0) {
		if (time !== "") time += ", ";
		time += `${seconds} second${seconds > 1 ? "s" : ""}`;
	}

	return time;
}

export = class Cooldown extends EventBase {
	public constructor() {
		super({ name: "cooldown", emitter: "commandhandler" });
	}

	public execute(message: Message, _: Command, timeLeft: number): void {
		const time = HumanTime(timeLeft);

		this.client.createMessage(message.channel.id, {
			content: `you have to wait \`${time}\` before using this command again.`,
			messageReference: { messageID: message.id }
		});
	}
};
