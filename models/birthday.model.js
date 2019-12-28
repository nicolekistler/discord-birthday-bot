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

		this.tableName = 'Two';

		this.schema = {
			TableName : this.tableName,
			KeySchema: [
				{ AttributeName: 'member_id', KeyType: 'HASH'}
			],
			AttributeDefinitions: [
				{ AttributeName: 'member_id', AttributeType: 'N' }
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 10,
				WriteCapacityUnits: 10
			}
		};
	}

	/* Check if record exists, create if not or update if so */
	set(memberId, birthDate, msg) {
		this.read(memberId).then(result => {
			if(Object.entries(result).length === 0 && result.constructor === Object) {
				console.log(`does not exist`);

				this.create(memberId, birthDate, msg);
			}
			else {
				console.log(`result exists`);

				this.update(memberId, birthDate);
			}
		});

	}

	/* Create birthday record */
	create(memberId, birthDate, msg) {
		const params = {
			TableName: this.tableName,
			Item: {
				member_id: memberId,
				birth_date: birthDate
			}
		};

		this.docClient.put(params, (err) => {
			if (err) {
				msg.reply('unable to add birthday, type `!bday help` for valid input guidelines');

				return;
			}

			msg.reply('birthday successfully added');
		});
	}

	/* Scan table for birthday by member ID */
	read(memberId) {
		const getParams = {
			TableName: this.tableName,
			AttributeName: {
				member_id: memberId
			},
			Key: {
				member_id: memberId
			}
		};

		return this.docClient.get(getParams, (err, data) => {
			if (err) {
				console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));

				return;
			}

			return JSON.stringify(data, null, 2);
		}).promise();
	}

	update(memberId, birthDate) {
		var params = {
			TableName: this.tableName,
			Key: {
				member_id: memberId
			},
			UpdateExpression: 'set birth_date = :b',
			ExpressionAttributeValues:{
				':b':birthDate
		},
			ReturnValues:'UPDATED_NEW'
		};

		console.log('Updating the item...');

		docClient.update(params, function(err, data) {
			if (err) {
				console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));

				return;
			}

			console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
		});
	}
}

module.exports = Birthday;
