const Discord = require('discord.js');
const moment  = require('moment');

const birthdayModel = require('./models/birthday.model');
const Birthday      = new birthdayModel();

class Command {
	constructor(msg) {
		const parsedInput = msg.content.split(' ');

		const commandMap = {
			'help'     : this.onHelp,
			'set'      : this.onSet,
			'confetti' : this.onConfetti,
			'upcoming' : this.onUpcoming,
		}

		if(parsedInput[0] != '!bday') {
			return;
		}

		const commandInput = parsedInput[1];

		if(Object.keys(commandMap).includes(commandInput)) {
			commandMap[commandInput](msg);
		}
		else {
			msg.reply('for info and valid Birthday Bot commands, type `!bday help`');
		}
	}

	/* When a user types !bday set, bot sets their bday */
	onSet(msg) {
		const parsedInput = msg.content.split(' ');

		const memberId  = Number(msg.member.id);
		const memberTag = msg.member.user.tag;
		const birthDate = parsedInput[2];

		const match = birthDate.match(/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])/);

		if(!match) {
			msg.reply('invalid birthday formatting, type `!bday help` for formatting examples');

			return;
		}

		const month = Number(match[1]);
		const day   = Number(match[2]);

		Birthday.set(memberId, memberTag, month, day, msg);
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

	/* When a user types !bday upcoming, a list of birthdays by month is sent */
	onUpcoming(msg) {
		const currentMonth = Number(moment().format('MM'));
		const currentDay   = Number(moment().format('DD'));

		Birthday.scan({
			ProjectionExpression: "#bm, #bd, #i, #t",
			FilterExpression: "#bm = :current_month and #bd > :current_day",
			ExpressionAttributeNames: {
				"#bm": "birth_month",
				"#bd": "birth_day",
				"#i": "member_id",
				'#t': "member_tag"
			},
			ExpressionAttributeValues: {
				":current_month": currentMonth,
				":current_day": currentDay
			}
		}).then(data => {
			const bdays = [];

			data.Items.forEach(item => {
				bdays.push(`▹ **${item.member_tag}** on ${item.birth_month}/${item.birth_day}`);
			});

			if(!bdays.length) {
				msg.reply(`no upcoming birthdays for the remainder of this month`);
			}
			else {
				msg.reply(`the following birthdays are coming up this month 🎂:\n${bdays.join('\n')}`);
			}
		});
	}
}

module.exports = Command;
