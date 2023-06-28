import { MikroLog } from 'mikrolog';

/**
 * @description Used when missing required parameters in the Slack slash command.
 */
export class MissingSlashCommandParametersError extends Error {
  constructor() {
    super();
    this.name = 'MissingSlashCommandParametersError';
    const message = `Missing required slash command parameters "command", "text", "user_id", and/or "user_name"!`;
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
