import "dotenv/config";

import type { CommandData, SlashCommandProps, CommandOptions } from "commandkit";
import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import client from "@/index";
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
        try {
            const channel = client.channels.cache.get(interaction.channelId) as TextChannel;
            const messageReference = channel.messages.cache.get(message_id);
            if (!messageReference) {
                return await channel.send({ content: `${message_text}`, flags: ["SuppressEmbeds"] });
            }
            return await channel.send({
                content: `${message_text}`,
                flags: ["SuppressEmbeds"],
                reply: { messageReference, failIfNotExists: true }
            });
        } catch (error) {
            console.error(`Error sending message: ${(error as Error).message}`);
            return interaction.reply({ content: "Failed to send message.", ephemeral: true });
        }
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
