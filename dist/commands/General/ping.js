export const data = {
    name: 'ping',
    description: 'Replies with Pong',
};
export const run = ({ interaction }) => {
    interaction.reply('Pong!');
};
export const options = {};
