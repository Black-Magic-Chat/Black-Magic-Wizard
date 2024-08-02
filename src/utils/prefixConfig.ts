import { db } from "@/db";
import "dotenv/config";

async function changePrefix(newPrefix: string | undefined) {
    await db.bot_config
        .update({ where: { server_id: "1249773101185630259" }, data: { prefix: newPrefix } })
        .catch(e => console.log(e));
}

async function currentPrefix(): Promise<string | undefined> {
    let prefix: string | undefined;
    await db.bot_config.findFirst({ where: { server_id: "1249773101185630259" } }).then(v => (prefix = v?.prefix));
    return prefix;
}

export { currentPrefix, changePrefix };
