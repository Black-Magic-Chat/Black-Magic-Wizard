import { currentPrefix } from "@/utils/prefixConfig";
import { type Message, EmbedBuilder } from "discord.js";

export default async function (message: Message<true>) {
    const prefix = await currentPrefix();
    if (message.content.startsWith(prefix + "roleInfo")) {
        if (!message.guild) return;

        const roleId = message.content.split(" ")[1];

        if (!roleId) {
            return message.reply("Please provide a valid role ID.");
        }

        try {
            const role = message.guild.roles.cache.get(roleId);
            if (!role) {
                return message.reply("Role not found.");
            }

            const roleInfoEmbed = new EmbedBuilder()
                .setColor(role.hexColor)
                .setDescription(`### <@&${role.id}> - ${role.position}`)
                .addFields(
                    { name: "ID", value: role.id, inline: true },
                    { name: "Color", value: role.hexColor, inline: true },
                    { name: "Hoisted", value: `${role.hoist}`, inline: true }
                )
                .setFooter({ text: `Created at: ${role.createdAt.toDateString()}` });

            message.channel.send({ embeds: [roleInfoEmbed] });
        } catch (error) {
            console.error("Error fetching role:", error);
            message.channel.send("There was an error fetching the role information.");
        }
    }
}
