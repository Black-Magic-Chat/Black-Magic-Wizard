import { type Message, EmbedBuilder } from "discord.js";

export default function (message: Message<true>) {
    if (message.content.startsWith("!removeRoleAll")) {
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
                if (member.roles.cache.has(role.id)) {
                    member.roles.remove(role).catch(console.error);
                }
            });
        });
        const assignEmbed = new EmbedBuilder().setDescription(`Role <@&${role.id}> is being removed from all members.`);
        message.reply({ embeds: [assignEmbed] });
        return true;
    }
}
