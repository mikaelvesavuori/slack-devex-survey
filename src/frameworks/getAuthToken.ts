import { MissingSlackAuthTokenError } from '../errors/MissingSlackAuthTokenError';

/**
 * @description Get the Slack authorization token from the environment.
 */
export function getAuthToken() {
  const token = process.env.SLACK_AUTH_TOKEN || '';
  if (!token) throw new MissingSlackAuthTokenError();

  return token;
}
