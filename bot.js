const Discord         = require('discord.js');
const commandService  = require('./command.service');
const eventController = require('./controllers/event.controller');
const config          = require('./config.json');

const client = new Discord.Client();
const event  = new eventController();

client.login(config.token);

client.on('ready', () => {
	client.channels.get(config.wishes_channel_id).send('Bot ready');
});

/* When bot joins Discord server for the first time, do stuff */
client.on('guildCreate', () => {
	event.onBotJoin(client);
});

/* Trigger command event if user calls bday bot */
client.on('message', msg => {
	new commandService(msg);
});

/* If a user leaves the Discord server, remove their bday */
client.on('guildMemberRemove', member => {
	event.onMemberLeave(member);
});
