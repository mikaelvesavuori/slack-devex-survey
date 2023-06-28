import { MikroLog } from 'mikrolog';

/**
 * @description Used when trying to get survey responses and parameters are missing.
 */
export class MissingGetSurveyResponsesParametersError extends Error {
  constructor() {
    super();
    this.name = 'MissingGetSurveyResponsesParametersError';
    const message = `Missing required parameters "from", and/or "to"!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
