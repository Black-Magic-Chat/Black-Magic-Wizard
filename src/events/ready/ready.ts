import type { Client } from "discord.js";
import { getAccessToken, checkPlaylist } from "../../utils/checkSongs";

export default async function (c: Client<true>) {
    console.log(`${c.user.username} is ready!`);
    await getAccessToken();
    checkPlaylist();
    setInterval(checkPlaylist, 10000);
}
