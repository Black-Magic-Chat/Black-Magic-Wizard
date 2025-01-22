import type { CommandData, SlashCommandProps, CommandOptions } from "commandkit";
import { changePrefix, currentPrefix } from "@/utils/prefixConfig";
import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import "dotenv/config";

export const data: CommandData = {
    name: "prefix",
    description: "Edit the bot prefix.",
    options: [
        {
            name: "new_prefix",
            description: "The new prefix",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
};

export const run = async ({ interaction, handler }: SlashCommandProps) => {
    const previous_prefix = await currentPrefix(interaction.commandGuildId!)
    const new_prefix = interaction.options.getString("new_prefix");
    if (!new_prefix) {
        return interaction.reply({ content: "Error occured setting prefix. Try again later.", flags: ["Ephemeral"] });
    }
    if (!interaction.commandGuildId) {
        return interaction.reply({
            content: `Command was run in an invalid channel/guild ${interaction.commandGuildId}`,
            flags: ["Ephemeral"]
        });
    }

    const { prefix, success, message } = await changePrefix(new_prefix, interaction.commandGuildId!);
    if (!success) {
        return interaction.reply({ content: message, flags: ["Ephemeral"] });
    }

    // Making sure the prefix is set on all cases
    handler.reloadCommands("global");
    handler.reloadEvents();

    const oldPrefix = inlineCode(`${previous_prefix}`);
    const currPrefix = inlineCode(`${prefix}`);
    interaction.reply({
        content: `Successfully changed prefix to ${currPrefix} \nOld Prefix: ${oldPrefix}`,
        flags: ["Ephemeral", "SuppressEmbeds"]
    });
};

export const options: CommandOptions = {
    devOnly: true
};
