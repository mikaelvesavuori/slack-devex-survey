/**
 * @description Factory function that returns a new `MappedSurveyResponses` value object.
 */
export function createNewMappedSurveyResponses(questions: string[]) {
  return new MappedSurveyResponses(questions);
}

/**
 * @description Creates a well-formed, mapped set of survey responses with
 * current questions as the keys, and values being the percentages of responses.
 */
class MappedSurveyResponses {
  private readonly questions: string[] = [];

  constructor(questions: string[]) {
    this.questions = questions;
  }
  /**
   * @description Gets the mapped responses.
   */
  public get(responses: Record<string, any>[]) {
    const allChoices = this.getAllChoices(responses);
    const mappedChoices = this.mapChoices(allChoices);
    const divisions = this.calculateDivisions(mappedChoices);
    return this.mappedResult(divisions);
  }

  /**
   * @description Retrieve all choices as a nicely split array of string.
   */
  private getAllChoices = (responses: Record<string, any>[]): string[][] =>
    responses.map((item) => item.choices.split(','));

  /**
   * @description Map choices and questions into an object.
   */
  private mapChoices(allChoices: string[][]) {
    const mappedChoices: Record<string, any> = {};

    allChoices.forEach((choices: string[]) => {
      choices.forEach((choice: string, index: number) => {
        const target = this.questions[index];
        if (!mappedChoices[target]) mappedChoices[target] = [];
        mappedChoices[target].push(choice);
      });
    });

    return mappedChoices;
  }

  /**
   * @description Calculates the percentage of each division (answer).
   */
  private calculateDivisions(mappedChoices: Record<string, any>): Record<string, any>[] {
    return this.questions
      .map((question) => {
        if (!mappedChoices[question]) return;
        const counts = this.countUnique(mappedChoices[question]);
        const unitValue = this.calculateUnitValue(counts);
        return this.getValuesAsKeyedObject(counts, unitValue);
      })
      .filter((item: Record<string, any> | undefined) => item) as Record<string, any>[];
  }

  private getValuesAsKeyedObject(counts: Record<string, any>, unitValue: number) {
    const result: Record<string, any> = {};

    Object.keys(counts)
      .sort()
      .forEach((key) => {
        const value = (counts[key] * unitValue).toFixed(3);
        result[key] = `${value}%`;
      });

    return result;
  }

  private mappedResult(divisions: Record<string, any>[]) {
    const result: Record<string, any> = {};
    divisions.forEach((division, index: number) => (result[this.questions[index]] = division));
    return result;
  }

  private countUnique(target: string[]) {
    const counts: Record<string, any> = {};
    for (const choice of target) counts[choice] = counts[choice] ? counts[choice] + 1 : 1;
    return counts;
  }

  private calculateUnitValue(counts: Record<string, any>) {
    const responses: number = Object.values(counts).reduce((acc, newValue) => acc + newValue);
    return 100 / responses;
  }
}
