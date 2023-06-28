import { createNewDevExSurvey } from 'devexbot';

import { SlashCommand } from './valueObjects/SlashCommand';

import { InputSlashCommand } from './interfaces/Commands';

import { emitEvent } from './frameworks/emitEvent';
import { getAuthToken } from './frameworks/getAuthToken';
import { getBody } from './frameworks/getBody';

/**
 * @description Handles Slack slash command interactions.
 *
 * Runs synchronously via the API when user presses enter/return when calling the slash command.
 */
export async function handler(event: Record<string, any>) {
  try {
    const body = getBody(event);
    const command = SlashCommand.createCommand(body);
    const response = await handleSlashCommand(command);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}

/**
 * @description Controller functionality to handle the supported commands and subcommands
 * from our Slack slash command.
 */
async function handleSlashCommand(input: InputSlashCommand) {
  const { command, text, userId, userName } = input;

  if (command === '/devex') {
    const authToken = getAuthToken();
    const subcommand = text.toLowerCase();

    if (subcommand === 'optin') {
      const detailType = process.env.EVENT_DETAIL_TYPE_OPTIN || '';
      return await optInUser({ detailType, authToken, userId, userName });
    } else if (subcommand === 'optout') {
      const detailType = process.env.EVENT_DETAIL_TYPE_OPTOUT || '';
      return await optOutUser({ detailType, authToken, userId, userName });
    }
  }
}

/**
 * @description Use case for opting in user.
 */
export async function optInUser(options: OptInOutUserOptions) {
  const { detailType, authToken, userId, userName } = options;
  const response = createNewDevExSurvey({ authToken }).createOptInResponse();
  await emitEvent(detailType, { userId, userName });
  return response;
}

/**
 * @description Use case for opting out user.
 */
export async function optOutUser(options: OptInOutUserOptions) {
  const { detailType, authToken, userId, userName } = options;
  const response = createNewDevExSurvey({ authToken }).createOptOutResponse();
  await emitEvent(detailType, { userId, userName });
  return response;
}

/**
 * @description Required inputs when opting in/out users in the usecase level.
 */
type OptInOutUserOptions = {
  detailType: string;
  authToken: string;
  userId: string;
  userName: string;
};
