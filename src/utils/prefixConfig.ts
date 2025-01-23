import { db } from "@/db";
import "dotenv/config";
import client from "..";

interface ChangePrefixResult {
    success: boolean;
    prefix: string;
    message: string;
}

const prefixCache: Map<string, string> = new Map();

async function validateGuild(guildId: string): Promise<void> {
    const guild = await db.bot_config.findFirst({ where: { server_id: guildId } });
    if (!guild) {
        console.log(`Guild ${guildId} not found`);
        await db.bot_config.create({ data: { prefix: "!", server_id: guildId } });
        console.log(`Guild ${guildId} created`);
    } else {
        console.log(`Guild ${guildId} found`);
    }
}

async function changePrefix(newPrefix: string, guildId: string): Promise<ChangePrefixResult> {
    const getCurrentPrefixValue = await getCurrentPrefix(guildId);
    if (getCurrentPrefixValue && newPrefix === getCurrentPrefixValue) {
        return {
            message: "Prefix equals to old prefix.",
            success: false,
            prefix: getCurrentPrefixValue
        };
    }
    try {
        await validateGuild(guildId);
        const updatedGuild = await db.bot_config.update({
            where: { server_id: guildId },
            data: { prefix: newPrefix }
        });

        prefixCache.set(guildId, newPrefix);

        console.log(`Guild ${updatedGuild.server_id} prefix updated to ${newPrefix}`);
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

async function getCurrentPrefix(guildId: string): Promise<string | undefined> {
    if (prefixCache.has(guildId)) {
        return prefixCache.get(guildId);
    }

    await validateGuild(guildId);
    const guild = await db.bot_config.findFirst({ where: { server_id: guildId } });

    if (guild?.prefix) {
        prefixCache.set(guildId, guild.prefix);
    }

    return guild?.prefix;
}

export { getCurrentPrefix, changePrefix };
