const Discord         = require('discord.js');
const commandService  = require('./command.service');
const eventController = require('./controllers/event.controller');
const config          = require('./config.json');

const client = new Discord.Client();
const event  = new eventController();

/* Provide token */
client.login(config.token);

/* Handle ready event */
client.on('ready', () => {
	client.channels.get(config.wishes_channel_id).send('Bot ready');
	event.onBotJoin(client);
});

/* Handle bot join event */
client.on('guildCreate', () => {
	event.onBotJoin(client);
});

/* Handle command */
client.on('message', msg => {
	new commandService(msg);
});

/* Handle member leave */
client.on('guildMemberRemove', member => {
	event.onMemberLeave(member);
});
