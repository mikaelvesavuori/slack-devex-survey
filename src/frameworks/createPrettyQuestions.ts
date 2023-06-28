/**
 * @description Transform comma-separated list of questions into a nice object.
 */
export const createPrettyQuestions = (choices: string) => {
  const choicesArray = choices.split(',');
  const questions: Record<string, string> = {};

  choicesArray.forEach(
    (choice: string, index: number) => (questions[`Question ${index + 1}`] = choice)
  );

  return questions;
};
