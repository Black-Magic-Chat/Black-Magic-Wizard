import { type Message } from "discord.js";

export default async function (message: Message<true>) {
    if (!message.guild) return
    if (message.content.startsWith("!ping")) {
        message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms`)
    }
}
