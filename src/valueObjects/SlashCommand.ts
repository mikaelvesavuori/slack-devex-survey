import { InputSlashCommand } from '../interfaces/Commands';

import { MissingSlashCommandParametersError } from '../errors/MissingSlashCommandParametersError';

/**
 * @description Creates correct objects that deal with Slack's slash commands.
 */
export class SlashCommand {
  static createCommand(body: Record<string, any>): InputSlashCommand {
    const command: string = body.command;
    const text: string = body.text;
    const userId: string = body.user_id;
    const userName: string = body.user_name;
    if (!command || !text || !userId || !userName) throw new MissingSlashCommandParametersError();

    return {
      command,
      text,
      userId,
      userName
    };
  }
}
