const config        = require('../config.json');
const birthdayModel = require('../models/birthday.model');

class Event {
	/* When the bot first joins the server, create table */
	onBotJoin(client) {
		this.createTable();

		client.channels.get(config.wishes_channel_id).send('Birthday Bot is now running, type `!bday help` for valid commands 🍰');
	}

	/* When a member leaves the server, check if record exists and delete if yes */
	onMemberLeave(member) {
		console.log(`<@${member.id}>`);
	}

	/* Create table using DynamoDB */
	createTable() {
		const birthday = new birthdayModel();

		birthday.dynamodb.createTable(birthday.schema, (err, data) => {
			if (err) {
				console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
			} else {
				console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
			}
		});
	}
}

module.exports = Event;
