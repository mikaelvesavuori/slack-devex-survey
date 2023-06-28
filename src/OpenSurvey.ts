import { createNewDevExSurvey } from 'devexbot';

import { createNewUsersRepository } from './infrastructure/UsersRepository';

import { getAuthToken } from './frameworks/getAuthToken';

import config from './config/SurveyConfiguration.json';

/**
 * @description Opens the survey to all opted-in users.
 *
 * Runs synchronously on API calls.
 */
export async function handler() {
  try {
    await openSurvey(getAuthToken());

    return {
      statusCode: 201
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}

/**
 * @description Use case for opening up the survey for all opted-in users.
 */
export async function openSurvey(authToken: string) {
  const users: string[] = await createNewUsersRepository().get();
  await createNewDevExSurvey({ authToken, config }).open(users);
}
