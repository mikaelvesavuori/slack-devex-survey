import { User } from './valueObjects/User';

import { createNewUsersRepository } from './infrastructure/UsersRepository';

import { getBody } from './frameworks/getBody';

/**
 * @description Opts out a user from the survey.
 *
 * Runs asynchronously on EventBridge events (`OptOut`).
 */
export async function handler(event: Record<string, any>) {
  const body = getBody(event);
  const command = User.createCommand(body);
  await optOut(command.userId);
}

/**
 * @description Handle opting out a user.
 */
export async function optOut(id: string) {
  await createNewUsersRepository().remove(id);
}
