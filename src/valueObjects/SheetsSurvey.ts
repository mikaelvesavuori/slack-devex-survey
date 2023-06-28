import { AddSheetsSurveyCommand } from '../interfaces/Commands';

import { MissingCreateSurveyResponseParametersError } from '../errors/MissingCreateSurveyResponseParametersError';

/**
 * @description Creates correct commands for Google Sheet interactions.
 *
 * Takes in a raw, unmodified EventBridge event object.
 */
export class SheetsSurvey {
  static createCommand(event: Record<string, any>): AddSheetsSurveyCommand {
    const timestamp: number = parseInt(event?.Records[0]?.dynamodb?.NewImage?.sk?.S || 0);
    const choices: string = event?.Records[0]?.dynamodb?.NewImage?.choices?.S;
    if (!timestamp || !choices) throw new MissingCreateSurveyResponseParametersError();

    return {
      timestamp,
      choices
    };
  }
}
