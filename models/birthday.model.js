const AWS    = require('aws-sdk');
const config = require('../config.json');

class Birthday {
	constructor() {
		AWS.config.update({
			region: config.db_region,
			endpoint: config.db_endpoint
		});

		this.dynamodb  = new AWS.DynamoDB();

		this.docClient = new AWS.DynamoDB.DocumentClient();

		this.tableName = 'Birthdays';

		this.schema    = {
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
}

module.exports = Birthday;
