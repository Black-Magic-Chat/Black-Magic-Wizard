import { getCurrentPrefix } from "@/utils/prefixConfig";
import { type Message } from "discord.js";

export default async function (message: Message<true>) {
    if (!message.guild) return;
    const prefix = getCurrentPrefix(message.channelId);
    if (message.content.startsWith(prefix + "ping")) {
        message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms`);
    }
}
