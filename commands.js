const Discord = require('discord.js');

class Commands {
	/* When a user types !bday help, list of commands is sent */
	onHelp(msg) {
		const commandList = [
			'\n`!bday help`: Pull up this menu\n',
			'`!bday set MM/DD`: Set or update sending user\'s bday\n',
			'`!bday confetti`: Throw confetti at user\n',
			'`!bday upcoming`: List upcoming bdays\n'
		];

		const helpEmbed = new Discord.RichEmbed()
		.setColor('#d6abde')
		.setTitle('Birthday Bot: Help Menu 🎉')
		.setDescription('Listed below are available bot commands')
		.setURL('https://github.com/nrckwr/discord-birthday-bot')
		.setThumbnail('https://i.imgur.com/gb48j0z.png')
		.addField('__COMMAND LIST__', commandList)
		.setTimestamp();

		msg.reply(helpEmbed);
	}

	/* When a user types !bday set, bot sets their bday */
	onSet(msg) {
		msg.reply('someone tried to set their bday');
	}

	/* When a user types !bday confetti, a cute message is sent */
	onConfetti(msg) {
		msg.reply('have some confetti ♡ (ﾉ^ヮ^)ﾉ*:・ﾟ✧');
	}

	/* When a user types @bday upcoming, a list of birthdays by month is sent */
	onUpcoming(msg) {
		msg.reply('someone wanted bot to list upcoming');
	}
}

module.exports = Commands;
