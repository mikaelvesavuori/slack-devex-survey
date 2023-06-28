import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput
} from '@aws-sdk/client-dynamodb';

import { DynamoItem } from '../interfaces/DynamoDb';

import { getCleanedItems } from '../frameworks/getCleanedItems';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

/**
 * @description Factory function to return a new `UsersRepository` instance.
 */
export function createNewUsersRepository() {
  return new UsersRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class UsersRepository {
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
   * @description Add (create/update) a user in the database.
   */
  public async add(id: string) {
    const command: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        pk: { S: 'USER' },
        sk: { S: id }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }

  /**
   * @description Remove a user from the database.
   */
  public async remove(id: string) {
    const command: DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: {
        pk: { S: 'USER' },
        sk: { S: id }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new DeleteItemCommand(command));
  }

  /**
   * @description Get user(s) from the database.
   */
  public async get(id?: string): Promise<string[]> {
    const getSingle = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND sk = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: 'USER' },
        ':sk': { S: id }
      }
    };

    const getAll = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: 'USER' }
      }
    };

    const command: QueryCommandInput = id ? getSingle : getAll;

    if (process.env.NODE_ENV !== 'test') {
      const data = (await this.docClient.send(new QueryCommand(command))) as any;
      return getCleanedItems(data.Items as DynamoItem[], { pk: 'pk', sk: 'id' }).map(
        (item: Record<string, any>) => item.id
      );
    }

    return [];
  }
}
