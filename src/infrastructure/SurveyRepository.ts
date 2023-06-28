import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput
} from '@aws-sdk/client-dynamodb';

import { AddSurveyResponseCommand } from '../interfaces/Commands';
import { DynamoItem } from '../interfaces/DynamoDb';
import { GetSurveyResponsesQuery } from '../interfaces/Queries';

import { getCleanedItems } from '../frameworks/getCleanedItems';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

/**
 * @description Factory function to return a new `SurveyRepository` instance.
 */
export function createNewSurveyRepository() {
  return new SurveyRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class SurveyRepository {
  docClient: DynamoDBClient;
  tableName: string;
  region: string;

  constructor() {
    this.region = process.env.REGION || '';
    this.tableName = process.env.TABLE_NAME || '';

    if (!this.region || !this.tableName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'REGION', value: process.env.REGION },
          { key: 'TABLE_NAME', value: process.env.TABLE_NAME }
        ])
      );

    this.docClient = new DynamoDBClient({ region: this.region });
  }

  /**
   * @description Add (create/update) a survey response in the database.
   */
  public async add(command: AddSurveyResponseCommand) {
    const { timestamp, choices } = command;
    const dbCommand: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        pk: { S: 'RESPONSE' },
        sk: { S: timestamp.toString() },
        choices: { S: choices.toString() } // Something does _not_ work right here, as SS will break...?
      }
    };

    await this.docClient.send(new PutItemCommand(dbCommand));
  }

  /**
   * @description Get all stored users.
   */
  public async get(query: GetSurveyResponsesQuery) {
    const { from, to } = query;
    const command: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk BETWEEN :from AND :to',
      ExpressionAttributeValues: {
        ':pk': { S: 'RESPONSE' },
        ':from': { S: from },
        ':to': { S: to }
      },
      ProjectionExpression: 'sk, choices'
    };

    const data = (await this.docClient.send(new QueryCommand(command))) as any;
    return getCleanedItems(data.Items as DynamoItem[], { sk: 'timestamp' });
  }
}
