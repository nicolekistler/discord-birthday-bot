const Discord       = require('discord.js');
const birthdayModel = require('./models/birthday.model');

class Command {
	constructor(msg) {
		const commandMap = {
			'help'     : this.onHelp,
			'set'      : this.onSet,
			'info'     : this.onInfo,
			'confetti' : this.onConfetti,
			'upcoming' : this.onUpcoming
		}

		const split = msg.content.split(' ');

		if(split[0] != '!bday') {
			return;
		}

		const commandInput = split[1];

		if(Object.keys(commandMap).includes(commandInput)) {
			commandMap[commandInput](msg);
		}
		else {
			this.onInvalid(msg);
		}
	}

	/* When a user types !bday set, bot sets their bday */
	onSet(msg) {
		const birthday = new birthdayModel();

		const memberId  = Number(msg.member.id);
		const birthDate = 'MM/DD';

		const params = {
			TableName: birthday.tableName,
			Item : {
				'member_id'  : memberId,
				'birth_date' : birthDate
			}
		};

		birthday.docClient.put(params, function(err, data) {
			if (err) {
				console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
			} else {
				console.log('Added item:', JSON.stringify(data, null, 2));

				msg.reply('someone tried to set their bday');
			}
		});
	}

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

	/* When a user types !bday confetti, a cute message is sent */
	onConfetti(msg) {
		msg.reply('have some confetti ♡ (ﾉ^ヮ^)ﾉ*:・ﾟ✧');
	}

	/* When a user types @bday upcoming, a list of birthdays by month is sent */
	onUpcoming(msg) {
		msg.reply('someone wanted bot to list upcoming');
	}

	onInvalid(msg) {
		msg.reply('for info and valid Birthday Bot commands, type `!bday help`');
	}

	validateBirthDate(msg) {
		msg.reply(msg.content);

		return birthDate;
	}
}

module.exports = Command;
