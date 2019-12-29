const birthdayModel = require('../models/birthday.model');
const Birthday      = new birthdayModel();

const config = require('../config.json');

class Event {
	/* When the bot first joins the server, create table */
	onBotJoin(client) {
		this.createTable();

		client.channels.get(config.wishes_channel_id).send('Birthday Bot is now running, type `!bday help` for valid commands 🍰');
	}

	/* When a member leaves the server, check if record exists and delete if yes */
	onMemberLeave(member) {
		Birthday.delete(Number(member.id));
	}

	/* Create table using DynamoDB */
	createTable() {
		Birthday.dynamodb.createTable(Birthday.schema, (err) => {
			if (err) {
				console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));

				return;
			}
		});
	}
}

module.exports = Event;
