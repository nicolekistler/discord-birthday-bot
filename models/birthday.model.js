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
				this.create(memberId, birthDate, msg);
			}
			else {
				this.update(memberId, birthDate, msg);
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
				console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));

				return;
			}

			return JSON.stringify(data, null, 2);
		}).promise();
	}

	/* Update birth date by member ID */
	update(memberId, birthDate, msg) {
		const updateParams = {
			TableName: this.tableName,
			Key: {
				member_id: memberId
			},
			UpdateExpression: 'set birth_date = :b',
			ExpressionAttributeValues: {
				':b': birthDate
		},
			ReturnValues:'UPDATED_NEW'
		};

		this.docClient.update(updateParams, (err) => {
			if (err) {
				console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));

				return;
			}

			msg.reply('birthday successfully updated');
		});
	}

	/* Delete record by member ID */
	delete(memberId) {
		var params = {
			TableName: this.tableName,
			Key: {
				member_id: memberId
			},
			ConditionExpression: 'member_id = :m',
			ExpressionAttributeValues: {
				':m': memberId
			}
		};

		this.docClient.delete(params, (err) => {
			if (err) {
				console.error('Unable to delete item. Error JSON:', JSON.stringify(err, null, 2));

				return;
			}
		});
	}
}

module.exports = Birthday;

// Write method that checks bdays with timer
// Write method that lists upcoming birthdays
