import { createNewDevExSurvey, SlackWebhookPayload } from 'devexbot';

import { emitEvent } from './frameworks/emitEvent';
import { getAuthToken } from './frameworks/getAuthToken';
import { getBody } from './frameworks/getBody';

/**
 * @description Handles Slack webhooks.
 *
 * Runs synchronously over the API every time a user interacts, for example,
 * with a survey element (dropdown, button...).
 */
export async function handler(event: Record<string, any>) {
  try {
    const body = getBody(event);
    const token = getAuthToken();
    const result = await closeSurvey(body, token);

    if (result === 'closed') await informAboutNewResponse(body, token);

    return {
      statusCode: 200
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message)
    };
  }
}

/**
 * @description Use case for checking whether or not the survey can be closed (or finished).
 */
export async function closeSurvey(payload: SlackWebhookPayload, authToken: string) {
  return await createNewDevExSurvey({ authToken }).close(payload);
}

/**
 * @description Use case for informing about a new (final/finished) response having come in.
 */
export async function informAboutNewResponse(payload: SlackWebhookPayload, authToken: string) {
  const response = createNewDevExSurvey({ authToken }).createSurveyResponse(payload);
  const detailType = process.env.EVENT_DETAIL_TYPE_ADD || '';
  await emitEvent(detailType, response);
}
