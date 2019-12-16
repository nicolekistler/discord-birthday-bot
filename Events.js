const Discord = require('discord.js');
const client  = new Discord.Client();

const config = require('./config.json');

class Events {
	/* When the bot first joins the server, do things */
	onBotJoin(guild) {
		console.log('Joined guild event emitted');
	}

	/* When a member leaves the server, check if record exists and delete if yes */
	onMemberLeave(member) {
		console.log(`<@${member.id}>`);
	}
}

module.exports = Events;
