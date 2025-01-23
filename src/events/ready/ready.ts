import type { Client } from "discord.js";
import { setAccessToken, checkPlaylist } from "../../utils/checkSongs";

let intervalSet = false;

export default async function (client: Client<true>) {
    console.log(`${client.user.username} is ready!`);
    await setAccessToken();

    if (!intervalSet) {
        setInterval(checkPlaylist, 10000);
        intervalSet = true;
    }
}
