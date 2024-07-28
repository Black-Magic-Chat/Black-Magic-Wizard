import type {
  CommandData,
  SlashCommandProps,
  CommandOptions,
} from "commandkit";
import { ApplicationCommandOptionType } from "discord.js";

export const data: CommandData = {
  name: "say",
  description: "Send a message via the bot",
  options: [
    {
      name: "message_text",
      description: "The text to send",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "dm_user_id",
      description: "UserID of the user to DM.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

export const run = async ({ interaction }: SlashCommandProps) => {
  const message_text = interaction.options.getString("message_text");
  const dm_user_id = interaction.options.getString("dm_user_id")

  if (!message_text) {
    return interaction.reply({ content: "No content given.", ephemeral: true });
  }
  //TODO: add dm functionality
  await interaction.channel?.send(`${message_text}`);
};

export const options: CommandOptions = {
  userPermissions: ["Administrator"],
};
