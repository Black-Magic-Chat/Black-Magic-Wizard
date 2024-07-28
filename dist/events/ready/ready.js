import { getAccessToken, checkPlaylist } from '../../utils/checkSongs';
export default async function (c, client, handler) {
    console.log(`${c.user.username} is ready!`);
    await getAccessToken();
    checkPlaylist();
    setInterval(checkPlaylist, 10000);
}
;
