import "dotenv/config";

import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit";

import { dirname as dn } from "node:path";
import { fileURLToPath } from "node:url";

const dirname = dn(fileURLToPath(import.meta.url));

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

new CommandKit({
    client,
    eventsPath: `${dirname}/events`,
    commandsPath: `${dirname}/commands`,
    bulkRegister: true,
    devGuildIds: ["1249773101185630259"],
    devUserIds: ["953708302058012702"]
});

client.login(process.env.TOKEN);

export default client;