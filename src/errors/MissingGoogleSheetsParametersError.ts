import { MikroLog } from 'mikrolog';

/**
 * @description Used when missing required Google Sheets environment variables.
 */
export class MissingGoogleSheetsParametersError extends Error {
  constructor() {
    super();
    this.name = 'MissingGoogleSheetsParametersError';
    const message = `Missing required environment variables for Google Sheets functionality!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
