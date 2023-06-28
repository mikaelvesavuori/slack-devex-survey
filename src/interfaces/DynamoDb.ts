/**
 * @description Record in the database.
 */
export type DynamoItem = {
  [key: string]: StringRepresentation;
};

/**
 * @description String that represents the value.
 */
export type StringRepresentation = {
  S: string;
};
