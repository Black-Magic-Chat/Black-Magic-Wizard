import type { Client } from 'discord.js';
import type { CommandKit } from 'commandkit';
import { getAccessToken, checkPlaylist } from '../../utils/checkSongs';

 
export default async function (c: Client<true>, client: Client<true>, handler: CommandKit) {
    console.log(`${c.user.username} is ready!`);
    await getAccessToken()
    checkPlaylist()
    setInterval(checkPlaylist, 10000)
};