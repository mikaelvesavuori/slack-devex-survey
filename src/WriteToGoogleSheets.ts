import { GoogleSpreadsheet } from 'google-spreadsheet';

import { AddSheetsSurveyCommand } from './interfaces/Commands';

import { SheetsSurvey } from './valueObjects/SheetsSurvey';

import { createPrettyQuestions } from './frameworks/createPrettyQuestions';
import { createTimestamp } from './frameworks/createTimestamp';

import { MissingGoogleSheetsParametersError } from './errors/MissingGoogleSheetsParametersError';

/**
 * @description Function handler for writing survey responses to Google Sheets.
 *
 * Runs asynchronously on DynamoDB stream events.
 */
export async function handler(event: Record<string, any>) {
  if (event?.Records[0]?.eventName !== 'INSERT') return; // Care only about inserts
  if (event?.Records[0]?.dynamodb?.Keys?.pk?.S === 'USER') return; // We don't care about user opt in/out

  const command = SheetsSurvey.createCommand(event);
  await WriteToGoogleSheets(command);
}

/**
 * @description Handle writing the survey response data to a Google Sheet in the correct format.
 */
async function WriteToGoogleSheets(command: AddSheetsSurveyCommand) {
  const documentId = process.env.GOOGLE_SHEETS_DOCUMENT_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!documentId || !clientEmail || !privateKey) throw new MissingGoogleSheetsParametersError();

  const { timestamp, choices } = command;

  const doc = new GoogleSpreadsheet(documentId);
  await doc.useServiceAccountAuth({
    client_email: clientEmail,
    private_key: privateKey.split(String.raw`\n`).join('\n')
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow({
    Timestamp: createTimestamp(timestamp),
    ...createPrettyQuestions(choices)
  });
}
