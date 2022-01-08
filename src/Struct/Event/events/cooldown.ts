import { EventBase } from "../EventBase";
import { Message } from "eris";
import { CommandBase as Command } from "../../Command/CommandBase";

export = class Cooldown extends EventBase {
	public constructor() {
		super({ name: "cooldown", emitter: "commandhandler" });
	}

	public execute(message: Message, _: Command, timeLeft: number): void {
		const minutes = timeLeft > 60 ? Math.floor(timeLeft / 60) : 0;
		const seconds = Math.floor(timeLeft - minutes * 60);
		const time = `${minutes > 10 ? minutes : `0${minutes}`}:${seconds > 10 ? seconds : `0${seconds}`}m`;

		this.client.createMessage(message.channel.id, {
			content: `you have to wait \`${time}\` before using this command again.`,
			messageReference: { messageID: message.id }
		});
	}
};
