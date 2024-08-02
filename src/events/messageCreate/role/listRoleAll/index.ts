import { type Message, EmbedBuilder } from "discord.js";

export default async function (message: Message<true>) {
    if (message.content.startsWith("!listRoleAll")) {
        if (!message.guild) return;
        try {
            const roles = await message.guild.roles.fetch();
            const rolesList = roles.map(role => `<@&${role.id}>`).join(", ");

            const listAllEmbed = new EmbedBuilder()
                .setTitle(`All roles in ${message.guild.name}`)
                .setDescription(`${rolesList}`);
            message.reply({ embeds: [listAllEmbed] });
            return true;
        } catch (err) {
            console.error(err);
        }
    }
}
