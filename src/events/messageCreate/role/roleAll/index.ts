import { getCurrentPrefix } from "@/utils/prefixConfig";
import { type Message, EmbedBuilder } from "discord.js";

export default function (message: Message<true>) {
    const prefix = getCurrentPrefix(message.channelId);
    if (message.content.startsWith(prefix + "roleAll")) {
        if (!message.member?.permissions.has("ManageRoles")) {
            return message.reply("You do not have sufficient permissions to manage roles.");
        }

        const roleId = message.content.split(" ")[1];
        if (!roleId) {
            return message.reply("Please provide a valid role ID.");
        }
        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply("Role not found.");
        }
        message.guild.members.fetch().then(members => {
            members.forEach(member => {
                if (!member.roles.cache.has(role.id)) {
                    member.roles.add(role).catch(console.error);
                }
            });
        });

        const assignEmbed = new EmbedBuilder().setDescription(`Role <@&${role.id}> is being assigned to all members.`);
        message.reply({ embeds: [assignEmbed] });
        return true;
    }
}
