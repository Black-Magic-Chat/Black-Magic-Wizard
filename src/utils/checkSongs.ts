import SpotifyWebApi from "spotify-web-api-node";
import { TextChannel, EmbedBuilder } from "discord.js";
import { client } from "..";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let lastTracks: (string | undefined)[] = [];

export async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);
  } catch (err) {
    console.error("Error fetching token: ", err);
  }
}

export async function checkPlaylist(): Promise<void> {
  try {
    const data = await spotifyApi.getPlaylistTracks(process.env.PLAYLIST_ID!);
    const tracks = data.body.items;

    const currentTracks = tracks.map((track) => track.track?.id);

    if (lastTracks.length === 0) {
      lastTracks = currentTracks;
      return;
    }

    const newTracks = tracks.filter(
      (track) => !lastTracks.includes(track.track?.id)
    );

    if (newTracks.length > 0) {
      const channel = client.channels.cache.get(process.env.CHANNEL_ID!) as TextChannel;

      for (const track of newTracks) {
        const artistData = await spotifyApi.getArtist(
          `${track.track?.artists[0]?.id}`
        );
        let artistImageUrl = artistData.body.images[0]?.url;
        if (!artistImageUrl) {
          artistImageUrl = process.env.PLAYLIST_IMAGE!;
        }

        let featuredArtists = track.track?.artists
          .slice(1)
          .map((artist) => {
            return `[${artist.name}](https://open.spotify.com/artist/${artist.id})`;
          })
          .join(", ");
        if (!featuredArtists) {
          featuredArtists = "No features on this song";
        }

        const trackName = track.track?.name;
        const artistName = track.track?.artists[0]?.name;
        const trackImage = track.track?.album.images[0]?.url;

        const SongEmbed = new EmbedBuilder()
          .setThumbnail(`${trackImage}`)
          // .setImage(`${trackImage ? trackImage : PLAYLIST_IMAGE}`)
          .setAuthor({
            name: "Black Magic Track",
            url: "https://open.spotify.com/playlist/1B1eXopWYYLQeCsf6RTuVL",
            iconURL: artistImageUrl,
          })
          .setTitle("New Song Added")
          .addFields(
            {
              name: "Title",
              value: `[${trackName}](https://open.spotify.com/track/${track.track?.id})`,
              inline: true,
            },
            {
              name: "Artist",
              value: `[${artistName}](https://open.spotify.com/artist/${track.track?.artists[0]?.id})`,
              inline: true,
            },
            {
              name: "Features",
              value: `${featuredArtists}`,
            }
          )
          .setColor("Random")
          .setFooter({ text: "BMC", iconURL: `${process.env.PLAYLIST_IMAGE!}` })
          .setTimestamp();

        await channel.send({ embeds: [SongEmbed] });
      }

      lastTracks = currentTracks;
    }
  } catch (error) {
    console.error("Error checking playlist", error);
  }
}
