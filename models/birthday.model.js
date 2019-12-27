const AWS    = require('aws-sdk');
const config = require('../config.json');

class Birthday {
	constructor() {
		AWS.config.update({
			region   : config.db_region,
			endpoint : config.db_endpoint
		});

		this.docClient = new AWS.DynamoDB.DocumentClient();
		this.dynamodb  = new AWS.DynamoDB();

		this.tableName = 'Birthdays';

		this.schema = {
			TableName : this.tableName,
			KeySchema: [
				{ AttributeName: 'member_id', KeyType: 'HASH'},
				{ AttributeName: 'birth_date', KeyType: 'RANGE' }
			],
			AttributeDefinitions: [
				{ AttributeName: 'member_id', AttributeType: 'N' },
				{ AttributeName: 'birth_date', AttributeType: 'S' }
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 10,
				WriteCapacityUnits: 10
			}
		};
	}

	create(memberId, birthDate, msg) {
		const params = {
			TableName : this.tableName,
			Item : {
				member_id: memberId,
				birth_date: birthDate
			}
		};

		// this.read();

		this.docClient.put(params, function(err, data) {
			if (err) {
				msg.reply('unable to add birthday, type `!bday help` for valid input guidelines');

				console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				msg.reply('birthday successfully added');

				console.log("Added item:", JSON.stringify(data, null, 2));
			}
		});
	}

	read(memberId) {
		var params = {
			TableName : this.tableName,
			AttributeName : {
				"member_id": memberId
			}
		};

		this.docClient.get(params, function(err, data) {
			if (err) {
				console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
			}
		});
	}
}

module.exports = Birthday;
