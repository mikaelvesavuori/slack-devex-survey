import { OptInOutUserCommand } from '../interfaces/Commands';

import { MissingEventDetailsError } from '../errors/MissingEventDetailsError';

/**
 * @description Vends correctly-formatted User objects.
 */
export class User {
  static createCommand(body: Record<string, any>): OptInOutUserCommand {
    const userId: string = body.userId;
    const userName: string = body.userName;
    if (!userId || !userName) throw new MissingEventDetailsError();

    return {
      userId,
      userName
    };
  }
}
