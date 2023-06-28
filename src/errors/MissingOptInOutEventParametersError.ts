import { MikroLog } from 'mikrolog';

/**
 * @description Used when missing parameters for opt in/out events.
 */
export class MissingOptInOutEventParametersError extends Error {
  constructor() {
    super();
    this.name = 'MissingOptInOutEventParametersError';
    const message = `Missing required parameters for emitting opt in/out event!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
