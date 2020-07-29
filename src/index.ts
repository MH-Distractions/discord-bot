import * as discord from 'discord.js';
import Team from './Team';

const client = new discord.Client();
const team = new Team();

client.on('ready', () => {
    console.log(`Connected as ${client.user.username}`);

    team.setBot(client);
});

client.on('error', console.log);

client.login(process.env.DISCORD_TOKEN);
