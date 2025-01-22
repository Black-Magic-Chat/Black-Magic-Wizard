import { currentPrefix } from "@/utils/prefixConfig";
import { type Message } from "discord.js";

const responses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes – definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
    "Man fuck you",
    "Just end it",
    "Why tf would you ask me that",
    "Please pull my plug",
    "WHAT?!??!?!!?"
];

export default async function (message: Message<true>) {
    const prefix = currentPrefix();
    if (message.content.startsWith(prefix + "8ball")) {
        if (!message.guild) return;
        const question = message.content.split(" ")[1];
        if (!question) {
            return message.reply("No question, No response <:silly:1268110986003615755>");
        }
        const response = responses[Math.floor(Math.random() * responses.length)];
        message.reply(`🎱 ${response}`);
    }
}
