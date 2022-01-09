"use strict";
const eris_1 = require("eris");
const EventBase_1 = require("../EventBase");
module.exports = class interactionCreate extends EventBase_1.EventBase {
    constructor() {
        super({ name: "interactionCreate" });
    }
    async execute(interact) {
        if (interact instanceof eris_1.ComponentInteraction) {
            const interaction = interact;
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
                    current.setTimeout = setTimeout(() => {
                        if (!this.client.function_loop[interaction.data.custom_id])
                            return;
                        delete this.client.function_loop[interaction.data.custom_id];
                        this.client.util.disableComponents(interaction);
                    }, current.timeout);
                    break;
                }
            }
            if (current.function)
                await current.function(interaction, ...current.paramaters);
        }
    }
};
