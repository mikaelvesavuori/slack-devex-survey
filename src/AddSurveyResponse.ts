import { AddSurveyResponseCommand } from './interfaces/Commands';

import { SurveyResponses } from './valueObjects/SurveyResponses';

import { createNewSurveyRepository } from './infrastructure/SurveyRepository';

import { getBody } from './frameworks/getBody';

/**
 * @description Adds a survey response.
 *
 * Runs asynchronously on EventBridge events (`AddResponse`).
 */
export async function handler(event: Record<string, any>) {
  const body = getBody(event);
  const command = SurveyResponses.createCommand(body);
  await addSurveyResponse(command);
}

/**
 * @description Use case for adding a survey response to the database.
 */
export async function addSurveyResponse(command: AddSurveyResponseCommand) {
  await createNewSurveyRepository().add(command);
}
