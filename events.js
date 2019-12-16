const AWS     = require('aws-sdk');
const Discord = require('discord.js');
const client  = new Discord.Client();

const config = require('./config.json');

class Events {
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
		AWS.config.update({
			region: config.db_region,
			endpoint: config.db_endpoint
		});

		var dynamodb = new AWS.DynamoDB();

		var params = {
			TableName : 'Birthdays',
			KeySchema: [
				{ AttributeName: 'MEMBER_ID', KeyType: 'HASH'},
				{ AttributeName: 'BIRTHDAY', KeyType: 'RANGE' }
			],
			AttributeDefinitions: [
				{ AttributeName: 'MEMBER_ID', AttributeType: 'N' },
				{ AttributeName: 'BIRTHDAY', AttributeType: 'S' }
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 10,
				WriteCapacityUnits: 10
			}
		};

		dynamodb.createTable(params, (err, data) => {
			if (err) {
				console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
			} else {
				console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
			}
		});
	}
}

module.exports = Events;
