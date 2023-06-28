import { MikroLog } from 'mikrolog';

/**
 * @description Used when a HTTPS fetch has failed.
 */
export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
