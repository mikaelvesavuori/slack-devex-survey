import { getTimestampForInputDate } from 'chrono-utils';

import { AddSurveyResponseCommand } from '../interfaces/Commands';
import { GetSurveyResponsesQuery } from '../interfaces/Queries';

import { MissingGetSurveyResponsesParametersError } from '../errors/MissingGetSurveyResponsesParametersError';
import { MissingEventDetailsError } from '../errors/MissingEventDetailsError';

/**
 * @description Creates correct objects that deal with inputting and reading survey data.
 */
export class SurveyResponses {
  static createCommand(body: Record<string, any>): AddSurveyResponseCommand {
    const choices: string[] = body.choices;
    const timestamp: number = body.timestamp;
    if (!choices || !timestamp) throw new MissingEventDetailsError();

    return {
      choices,
      timestamp
    };
  }

  static createQuery(body: Record<string, any>): GetSurveyResponsesQuery {
    const from: string = body.from;
    const to: string = body.to;
    const offset: number = body.offset || 0;
    if (!from || !to) throw new MissingGetSurveyResponsesParametersError();

    return {
      from: getTimestampForInputDate(from, offset),
      to: getTimestampForInputDate(to, offset, true)
    };
  }
}
