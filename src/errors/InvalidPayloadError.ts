import { MikroLog } from 'mikrolog';

/**
 * @description Used when the Slack payload is incorrect.
 */
export class InvalidPayloadError extends Error {
  constructor() {
    super();
    this.name = 'InvalidPayloadError';
    const message = `Slack webhook payload does not contain expected properties!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
