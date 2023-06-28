import { User } from './valueObjects/User';

import { createNewUsersRepository } from './infrastructure/UsersRepository';

import { getBody } from './frameworks/getBody';

/**
 * @description Opts in a user to the survey.
 *
 * Runs asynchronously on EventBridge events (`OptIn`).
 */
export async function handler(event: Record<string, any>) {
  const body = getBody(event);
  const command = User.createCommand(body);
  await optIn(command.userId);
}

/**
 * @description Handle opting in a user.
 */
export async function optIn(id: string) {
  await createNewUsersRepository().add(id);
}
