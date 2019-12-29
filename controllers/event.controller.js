const birthdayModel = require('../models/birthday.model');
const Birthday      = new birthdayModel();

const config = require('../config.json');
const moment = require('moment');

class Event {
	/* When send wishes is triggered, send bday wishes */
	sendWishes(client) {
		const currentMonth = Number(moment().format('MM'));
		const currentDay   = Number(moment().format('DD'));

		Birthday.scan({
			ProjectionExpression: '#bm, #bd, #i, #t',
			FilterExpression: '#bm = :current_month and #bd = :current_day',
			ExpressionAttributeNames: {
				'#bm': 'birth_month',
				'#bd': 'birth_day',
				'#i': 'member_id',
				'#t': 'member_tag'
			},
			ExpressionAttributeValues: {
				':current_month': currentMonth,
				':current_day': currentDay
			}
		}).then(data => {
			const bdays = [];

			data.Items.forEach(item => {
				bdays.push(`<@${item.member_id}>`);
			});

			if(bdays.length) {
				client
					.channels
					.get(config.wishes_channel_id)
					.send(`${bdays.join(' ')}, happy birthday 🎉!!!`);
			}
		});
	}

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
