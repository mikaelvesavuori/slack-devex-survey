import { MikroLog } from 'mikrolog';

/**
 * @description Used when parameters are missing.
 */
export class MissingRequiredParametersError extends Error {
  constructor() {
    super();
    this.name = 'MissingRequiredParametersError';
    const message = `Missing required parameter "authToken"!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
