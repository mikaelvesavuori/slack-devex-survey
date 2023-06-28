/**
 * @description Represents the adapted input from a Slack slash command.
 */
export type InputSlashCommand = {
  command: string;
  text: string;
  userId: string;
  userName: string;
};

/**
 * @description Specific details/data for "AddSurveyResponse" events.
 */
export type AddSurveyResponseCommand = {
  choices: string[];
  timestamp: number;
};

/**
 * @description Required details for opting in/out a user.
 */
export type OptInOutUserCommand = {
  userId: string;
  userName: string;
};

/**
 * @description Represents a survey response.
 */
export type AddSheetsSurveyCommand = {
  timestamp: number;
  choices: string;
};
