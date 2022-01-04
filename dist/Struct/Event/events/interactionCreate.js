"use strict";
const eris_1 = require("eris");
const EventBase_1 = require("../EventBase");
module.exports = class interactionCreate extends EventBase_1.EventBase {
    constructor() {
        super({ name: "interactionCreate" });
    }
    async execute(interaction) {
        if (interaction.type !== eris_1.Constants.InteractionTypes.MESSAGE_COMPONENT)
            return;
        const queue = this.client.function_loop;
        let current = {
            function: () => void 0,
            paramaters: [],
            timeout: 0
        };
        for (const [key, value] of Object.entries(queue)) {
            if (key === interaction.data.custom_id) {
                current.function = value.function;
                current.paramaters = value.paramaters;
                current.timeout = value.timeout;
                if (current.setTimeout)
                    clearTimeout(current.setTimeout);
                setTimeout(() => {
                    delete this.client.function_loop[interaction.data.custom_id];
                    this.client.util.disableComponents(interaction);
                }, current.timeout);
                break;
            }
        }
        await current.function(interaction, ...current.paramaters);
    }
};
