import * as discord from 'discord.js';
import Team from './Team';
import Commands from './Commands';

const client = new discord.Client();
const team = new Team();
const commands = new Commands();

client.on('ready', () => {
    console.log(`Connected as ${client.user.username}`);
    team.setBot(client);
    commands.setBot(client);
});

client.on('error', console.log);

client.login(process.env.DISCORD_TOKEN);
