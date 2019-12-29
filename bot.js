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
	event.sendWishes(client);

	const time = 1000 * 60 * 60 * 24;

	setInterval(() => {
		event.sendWishes(client);
	}, time);
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
