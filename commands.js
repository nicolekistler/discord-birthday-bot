class Commands {
	/* When a user types !bday help, list of commands is sent */
	onHelp(msg) {
		msg.reply('someone called for halp');
	}

	/* When a user types !bday set, bot sets their bday */
	onSet(msg) {
		msg.reply('someone tried to set their bday');
	}

	/* When a user types !bday info, info about bot is sent */
	onInfo(msg) {
		msg.reply('someone wanted bot info');
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
