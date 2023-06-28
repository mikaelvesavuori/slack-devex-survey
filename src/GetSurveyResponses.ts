import { DevExSurveyConfigurationInput, createNewDevExSurvey } from 'devexbot';

import { GetSurveyResponsesQuery } from './interfaces/Queries';

import { SurveyResponses } from './valueObjects/SurveyResponses';
import { createNewMappedSurveyResponses } from './valueObjects/MappedSurveyResponses';

import { createNewSurveyRepository } from './infrastructure/SurveyRepository';

import { getAuthToken } from './frameworks/getAuthToken';
import { getBody } from './frameworks/getBody';

import config from './config/SurveyConfiguration.json';

/**
 * @description Get survey responses.
 *
 * Runs synchronously over the API.
 */
export async function handler(event: Record<string, any>) {
  try {
    const body = getBody(event);
    const query = SurveyResponses.createQuery(body);
    const responses = await getSurveyResponses(query, getAuthToken(), config);

    return {
      statusCode: 200,
      body: JSON.stringify(responses)
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}

/**
 * @description Use case for getting survey responses.
 */
export async function getSurveyResponses(
  query: GetSurveyResponsesQuery,
  authToken: string,
  config?: DevExSurveyConfigurationInput
) {
  const questions = createNewDevExSurvey({ authToken, config }).config.questions;
  const responses = await createNewSurveyRepository().get(query);
  return createNewMappedSurveyResponses(questions).get(responses);
}
