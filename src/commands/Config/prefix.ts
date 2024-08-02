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
    const newPrefix = interaction.options.getString("new_prefix");
    if (!newPrefix) {
        return interaction.reply({ content: "Error occured setting prefix. Try again later.", ephemeral: true });
    }
    changePrefix(newPrefix);
    //Making sure the prefix is set on all cases
    handler.reloadCommands("global");
    handler.reloadEvents();

    const currPrefix = inlineCode(`${currentPrefix()}`);
    interaction.reply({
        content: `Successfully changed prefix to ${currPrefix}`,
        ephemeral: true
    });
};

export const options: CommandOptions = {
    devOnly: true
};
