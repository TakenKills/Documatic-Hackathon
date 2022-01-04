import { EventBase } from "../EventBase";
import { Message } from "eris";
import { CommandBase as Command } from "../../Command/CommandBase";

export = class Cooldown extends EventBase {
	public constructor() {
		super({ name: "cooldown", emitter: "commandhandler" });
	}

	public execute(message: Message, _: Command, timeLeft: number): void {
		let time;
		if (timeLeft < 59000) time = timeLeft.toFixed(2) + " seconds";
		else {
			const minutes = Math.floor(timeLeft / 60000);
			const seconds = Math.floor((timeLeft - minutes * 60000) / 1000);
			time = minutes + " minutes and " + seconds + " seconds";
		}
		message.channel.createMessage({
			content: `you have to wait \`${time}\` before using this command again.`,
			messageReference: { messageID: message.id }
		});
	}
};
