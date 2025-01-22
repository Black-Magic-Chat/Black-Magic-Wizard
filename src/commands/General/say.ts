import "dotenv/config";

import type { CommandData, SlashCommandProps, CommandOptions } from "commandkit";
import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { client } from "@/index";
const DISCORD_ENDPOINT = "https://discord.com/api/v10";
interface BodyData {
    content: string;
    message_reference: {
        message_id: string;
    };
}

export const data: CommandData = {
    name: "say",
    description: "Send a message via the bot",
    options: [
        {
            name: "message_text",
            description: "The text to send",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "message_id",
            description: "Message ID to reply to",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ]
};
//TODO: add dm functionality
export const run = async ({ interaction }: SlashCommandProps) => {
    const message_text = interaction.options.getString("message_text");
    const message_id = interaction.options.getString("message_id");

    if (!message_text) {
        return interaction.reply({ content: "No content given.", ephemeral: true });
    }
    if (message_id) {
        const bodyData: BodyData = {
            content: message_text,
            message_reference: {
                message_id: message_id
            }
        };
        try {
            const res = await fetch(`${DISCORD_ENDPOINT}/channels/${interaction.channelId}/messages`, {
                method: "POST",
                headers: { Authorization: `Bot ${process.env.TOKEN}` },
                body: JSON.stringify(bodyData)
            });
            if (!res.ok) {
                throw new Error(`Failed to send message: ${res.statusText}`);
            }
            console.log(`Message sent: ${res.status}`);
        } catch (error) {
            console.error(`Error sending message: ${(error as Error).message}`);
            return interaction.reply({ content: "Failed to send message.", ephemeral: true });
        }
        return;
    }
    try {
        const channel = client.channels.cache.get(interaction.channelId) as TextChannel;
        await channel.send({ content: `${message_text}`, flags: ["SuppressEmbeds"] });
    } catch (error) {
        console.error(`Error sending message: ${(error as Error).message}`);
        return interaction.reply({ content: "Failed to send message.", ephemeral: true });
    }
};

export const options: CommandOptions = {
    userPermissions: ["Administrator"]
};
