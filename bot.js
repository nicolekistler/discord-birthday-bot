const Discord = require('discord.js');
const client  = new Discord.Client();

const commands = require('./commands');
const command  = new commands();

const events = require('./events');
const event  = new events();

const config = require('./config.json');

const commandMap = {
	'help'     : command.onHelp,
	'set'      : command.onSet,
	'info'     : command.onInfo,
	'confetti' : command.onConfetti,
	'upcoming' : command.onUpcoming
}

client.login(config.token);

/* When bot joins guild for the first time, do stuff */
client.on('guildCreate', guild => {
	if(!config.wishes_channel_id) {
		throw new Error('Channel ID for birthday wishes not specified in config');
	}

	event.onBotJoin(guild);

	client
		.channels
		.get(config.wishes_channel_id)
		.send('Birthday Bot is now running, type `!bday help` for valid commands 🍰');
});

/* Trigger command event if user calls bday bot */
client.on('message', msg => {
	const split = msg.content.split(' ');

	if(split[0] != '!bday') {
		return;
	}

	const command_input = split[1];

	if(Object.keys(commandMap).includes(command_input)) {
		commandMap[command_input](msg);
	}
	else {
		msg.reply('for info and valid Birthday Bot commands, type `!bday help`');
	}

});

/* If a user leaves the discord server, remove their bday */
client.on('guildMemberRemove', member => {
	event.onMemberLeave(member);
});
