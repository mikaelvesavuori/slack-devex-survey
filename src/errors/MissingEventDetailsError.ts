import { MikroLog } from 'mikrolog';

/**
 * @description Used when EventBridge event details are missing.
 */
export class MissingEventDetailsError extends Error {
  constructor() {
    super();
    this.name = 'MissingEventDetailsError';
    const message = `Missing event details!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
