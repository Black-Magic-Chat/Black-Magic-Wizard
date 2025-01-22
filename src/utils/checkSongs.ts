import SpotifyWebApi from "spotify-web-api-node";
import { TextChannel, EmbedBuilder } from "discord.js";
import { client } from "..";
import "dotenv/config";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const PLAYLIST_ID = "1B1eXopWYYLQeCsf6RTuVL";
const CHANNEL_ID = "1250052890991788144";
const PLAYLIST_IMAGE =
    "https://media.discordapp.net/attachments/1249776327456854048/1266847146645393458/bmc.png?ex=66a6a2d8&is=66a55158&hm=30e6fb08f3cd94e7067b0cd6a7bc474247e0f270d2d4910a2d47e0bf8343edb4&=&format=webp&quality=lossless&width=383&height=385";

let lastTracks: string[] = [];

async function getAccessToken() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body["access_token"]);
    } catch (err) {
        console.error("Error fetching token: ", err);
    }
}

async function checkPlaylist(): Promise<void> {
    try {
        const data = await spotifyApi.getPlaylistTracks(PLAYLIST_ID);
        const tracks = data.body.items;

        const currentTracks = tracks.map(track => track.track?.id).filter(Boolean) as string[];

        if (lastTracks.length === 0) {
            lastTracks = currentTracks;
            return;
        }

        const newTracks = tracks.filter(track => track.track?.id && !lastTracks.includes(track.track.id));

        if (newTracks.length > 0) {
            const channel = client.channels.cache.get(CHANNEL_ID) as TextChannel;
            const SongEmbed = new EmbedBuilder()
                .setTitle("New Songs Added")
                .setColor("Random")
                .setFooter({ text: "BMC", iconURL: PLAYLIST_IMAGE })
                .setTimestamp();

            for (const track of newTracks) {
                const trackName = track.track?.name || "Unknown";
                const artistName = track.track?.artists[0]?.name || "Unknown";
                const trackId = track.track?.id || "";
                const artistId = track.track?.artists[0]?.id || "";
                const featuredArtists =
                    track.track?.artists
                        .slice(1)
                        .map(artist => `[${artist.name}](https://open.spotify.com/artist/${artist.id})`)
                        .join(", ") || "No features on this song";

                SongEmbed.addFields(
                    {
                        name: "Title",
                        value: `[${trackName}](https://open.spotify.com/track/${trackId})`,
                        inline: true
                    },
                    {
                        name: "Artist",
                        value: `[${artistName}](https://open.spotify.com/artist/${artistId})`,
                        inline: true
                    },
                    {
                        name: "Features",
                        value: featuredArtists
                    }
                );
            }

            await channel.send({ embeds: [SongEmbed] });
            lastTracks = currentTracks;
        }
    } catch (error) {
        console.error("Error checking playlist", error);
    }
}

export { getAccessToken, checkPlaylist };
