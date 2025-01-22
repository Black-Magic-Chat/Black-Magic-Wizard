import { db } from "@/db";
import "dotenv/config";
import { client } from "..";

interface ChangePrefixResult {
    success: boolean;
    prefix: string;
    message: string;
}

async function validate(guildId: string) {
    const guild = await db.bot_config.findFirst({ where: { server_id: guildId } });
    if (!guild) {
        //console.log(`Guild ${guildId} not found`);
        await db.bot_config
            .create({ data: { prefix: "!", server_id: guildId } })
            .then(v => console.log(`Guild ${v.server_id} created`))
            .catch(e => console.error(e));
    } else {
        //console.log(`Guild ${client.guilds.cache.get(guildId)?.name} found`);
    }
}

async function changePrefix(newPrefix: string | undefined, guildId: string): Promise<ChangePrefixResult> {
    const oldPrefix = await currentPrefix(guildId);
    if (oldPrefix && newPrefix === oldPrefix)
        return {
            message: "Prefix equals to old prefix.",
            success: false,
            prefix: oldPrefix
        };
    try {
        await validate(guildId);
        const updatedGuild = await db.bot_config.update({
            where: { server_id: guildId },
            data: { prefix: newPrefix }
        });

        console.log(`Guild ${updatedGuild.server_id} prefix updated to ${newPrefix} / ${updatedGuild.prefix}`);
        return {
            success: true,
            prefix: updatedGuild.prefix,
            message: "Successfully updated prefix."
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            prefix: "!",
            message: "Updating started, but couldn't finish."
        };
    }
}

async function currentPrefix(guildId: string): Promise<string | undefined> {
    await validate(guildId);
    let prefix: string | undefined;
    await db.bot_config.findFirst({ where: { server_id: "1249773101185630259" } }).then(v => (prefix = v?.prefix));
    return prefix;
}

export { currentPrefix, changePrefix };
