const Discord = require('discord.js');
const client  = new Discord.Client();

const commands = require('./commands');
const command  = new commands();

const auth = require('./auth.json');

const commandMap = {
	'help'     : command.onHelp,
	'set'      : command.onSet,
	'info'     : command.onInfo,
	'confetti' : command.onConfetti,
	'upcoming' : command.onUpcoming
}

/* Send message to specified channel on ready */
client.on('ready', () => {
	client
		.channels
		.get(auth.channel_id)
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

/* If a user leaves the discord server, check if they have a birthday and remove it if so */
client.on('guildMemberRemove', member => {
	// Do something here
});

client.login(auth.token);
