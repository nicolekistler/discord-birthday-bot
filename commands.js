class commands {
	/* When a user enters help command */
	onHelp(msg) {
		msg.reply('someone called for halp');
	}

	/* When a user enters set command */
	onSet(msg) {
		msg.reply('someone tried to set their bday');
	}

	/* When a user enters info command */
	onInfo(msg) {
		msg.reply('someone wanted bot info');
	}

	/* When a user enters confetti command */
	onConfetti(msg) {
		msg.reply('someone wanted bot to throw confetti');
	}

	/* When a user enters upcoming command */
	onUpcoming(msg) {
		msg.reply('someone wanted bot to list upcoming');
	}
}

module.exports = commands;

// msg.reply(`<@${msg.member.id}>`);
