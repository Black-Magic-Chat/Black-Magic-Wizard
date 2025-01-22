import { db } from "@/db";
import "dotenv/config";

async function validate(guildId: string) {
    const guild = await db.bot_config.findFirst({ where: { server_id: guildId } });
    if (!guild) {
        await db.bot_config.create({ data: { prefix: "!", server_id: guildId } });
    }
}

async function changePrefix(newPrefix: string | undefined, guildId: string) {
    await validate(guildId);
    await db.bot_config
        .update({ where: { server_id: "1249773101185630259" }, data: { prefix: newPrefix } })
        .catch(e => console.log(e));
}

async function currentPrefix(guildId: string): Promise<string | undefined> {
    await validate(guildId);
    let prefix: string | undefined;
    await db.bot_config.findFirst({ where: { server_id: "1249773101185630259" } }).then(v => (prefix = v?.prefix));
    return prefix;
}

export { currentPrefix, changePrefix };
