import { MikroLog } from 'mikrolog';

/**
 * @description Used when the Slack authorization token is missing.
 */
export class MissingSlackAuthTokenError extends Error {
  constructor() {
    super();
    this.name = 'MissingSlackAuthTokenError';
    const message = `Missing Slack authorization token!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
