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

		this.tableName = 'TestNewFour';

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
	set(memberId, memberTag, month, day, msg) {
		this.read(memberId).then(result => {
			if(Object.entries(result).length === 0 && result.constructor === Object) {
				this.create(memberId, memberTag, month, day, msg);
			}
			else {
				this.update(memberId, memberTag, month, day, msg);
			}
		});

	}

	/* Create birthday record */
	create(memberId, memberTag, month, day, msg) {
		const params = {
			TableName: this.tableName,
			Item: {
				member_id: memberId,
				member_tag: memberTag,
				birth_month: month,
				birth_day: day
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
	update(memberId, memberTag, month, day, msg) {
		const updateParams = {
			TableName: this.tableName,
			Key: {
				member_id: memberId
			},
			UpdateExpression: 'set birth_month = :m, birth_day = :d, member_tag = :t',
			ExpressionAttributeValues: {
				':m': month,
				':d': day,
				':t': memberTag
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
		const params = {
			TableName: this.tableName,
			Key: {
				member_id: memberId
			},
			ConditionExpression: 'member_id = :i',
			ExpressionAttributeValues: {
				':i': memberId
			}
		};

		this.docClient.delete(params, (err) => {
			if (err) {
				console.error('Unable to delete item. Error JSON:', JSON.stringify(err, null, 2));

				return;
			}
		});
	}

	scan(params = null) {
		params.TableName = this.tableName;

		return this.docClient.scan(params, (err, data) => {
			if(err) {
				console.log(err);

				return;
			}

			return data;
		}).promise();
	}
}

module.exports = Birthday;

// Write method that checks bdays with timer
// Write method that lists upcoming birthdays
