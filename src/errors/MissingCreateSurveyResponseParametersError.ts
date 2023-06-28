import { MikroLog } from 'mikrolog';

/**
 * @description Used when the payload to write to Google Sheets is missing something.
 */
export class MissingCreateSurveyResponseParametersError extends Error {
  constructor() {
    super();
    this.name = 'MissingCreateSurveyResponseParametersError';
    const message = `Missing expected parameters when creating the survey response data to write to Google Sheets!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
